import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

function getCleanS3Endpoint(rawEndpoint?: string): string | undefined {
  if (!rawEndpoint) return undefined;
  const clean = rawEndpoint.trim().replace(/\/$/, "");
  if (clean.includes(".r2.cloudflarestorage.com")) {
    return clean.split(".r2.cloudflarestorage.com")[0] + ".r2.cloudflarestorage.com";
  }
  return clean;
}

function getEndpointBucketCandidate(rawEndpoint?: string): string | null {
  if (!rawEndpoint) return null;
  const clean = rawEndpoint.trim().replace(/\/$/, "");
  if (clean.includes(".r2.cloudflarestorage.com/")) {
    const parts = clean.split(".r2.cloudflarestorage.com/");
    if (parts.length > 1 && parts[1]) {
      return parts[1].split("/")[0].trim();
    }
  }
  return null;
}

const cleanEndpoint = getCleanS3Endpoint(process.env.S3_ENDPOINT);

const s3Client =
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_REGION
    ? new S3Client({
        region: process.env.S3_REGION,
        endpoint: cleanEndpoint || undefined,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      })
    : null;

const PRIMARY_BUCKET = process.env.S3_BUCKET_NAME || "";
const SECONDARY_BUCKET = getEndpointBucketCandidate(process.env.S3_ENDPOINT);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get("url");
  const keyParam = searchParams.get("key");
  const bucketParam = searchParams.get("bucket");
  const rangeHeader = req.headers.get("range") || undefined;

  try {
    let targetKey = keyParam || "";
    let targetBucket = bucketParam || PRIMARY_BUCKET || SECONDARY_BUCKET || "";

    if (urlParam && urlParam.includes(".r2.cloudflarestorage.com/")) {
      const pathAfterDomain = urlParam.split(".r2.cloudflarestorage.com/")[1];
      if (pathAfterDomain) {
        const parts = pathAfterDomain.split("/");
        const firstSegment = parts[0];
        if (firstSegment === PRIMARY_BUCKET || firstSegment === SECONDARY_BUCKET) {
          targetBucket = firstSegment;
          targetKey = parts.slice(1).join("/");
        } else if (PRIMARY_BUCKET || SECONDARY_BUCKET) {
          targetBucket = PRIMARY_BUCKET || (SECONDARY_BUCKET as string);
          targetKey = pathAfterDomain;
        } else {
          targetBucket = firstSegment;
          targetKey = parts.slice(1).join("/");
        }
      }
    }

    // 1. Try fetching via S3 SDK if credentials exist
    if (s3Client && targetKey && targetBucket) {
      try {
        const getParams = {
          Bucket: targetBucket,
          Key: targetKey,
          Range: rangeHeader,
        };

        const s3Response = await s3Client.send(new GetObjectCommand(getParams));

        if (s3Response.Body) {
          const webStream = s3Response.Body.transformToWebStream();
          const hasContentRange = Boolean(s3Response.ContentRange);
          const status = hasContentRange ? 206 : 200;

          const headers = new Headers({
            "Content-Type": s3Response.ContentType || "audio/mpeg",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
          });

          if (s3Response.ContentLength !== undefined) {
            headers.set("Content-Length", s3Response.ContentLength.toString());
          }
          if (hasContentRange && s3Response.ContentRange) {
            headers.set("Content-Range", s3Response.ContentRange);
          }

          return new NextResponse(webStream as any, { status, headers });
        }
      } catch (s3Err: any) {
        console.warn(`[api/media] S3 fetch failed for bucket=${targetBucket} key=${targetKey}:`, s3Err.message);
        // Fall through to HTTP fetch fallback below if urlParam exists
      }
    }

    // 2. If S3 failed or credentials unconfigured, fallback to standard HTTP fetch if urlParam exists
    if (urlParam) {
      const fetchUrl = urlParam.startsWith("/") ? new URL(urlParam, req.url).toString() : urlParam;
      const fetchHeaders: HeadersInit = rangeHeader ? { Range: rangeHeader } : {};
      const httpRes = await fetch(fetchUrl, { headers: fetchHeaders });

      if (httpRes.ok || httpRes.status === 206) {
        const status = httpRes.status;
        const headers = new Headers({
          "Content-Type": httpRes.headers.get("content-type") || "audio/mpeg",
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        });

        const contentLength = httpRes.headers.get("content-length");
        if (contentLength) headers.set("Content-Length", contentLength);

        const contentRange = httpRes.headers.get("content-range");
        if (contentRange && status === 206) headers.set("Content-Range", contentRange);

        return new NextResponse(httpRes.body as any, { status: contentRange ? 206 : 200, headers });
      }
    }

    return NextResponse.json({ error: "Media object not found or inaccessible" }, { status: 404 });
  } catch (err: any) {
    console.error("Media proxy final error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch media object" }, { status: 500 });
  }
}
