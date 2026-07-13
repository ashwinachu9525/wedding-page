import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

// Clean Cloudflare R2 endpoint if it accidentally has a bucket path appended in env variables
function getCleanS3Endpoint(rawEndpoint?: string): string | undefined {
  if (!rawEndpoint) return undefined;
  const clean = rawEndpoint.trim().replace(/\/$/, "");
  if (clean.includes(".r2.cloudflarestorage.com")) {
    return clean.split(".r2.cloudflarestorage.com")[0] + ".r2.cloudflarestorage.com";
  }
  return clean;
}

// Extract any bucket name that might have been embedded inside S3_ENDPOINT path
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

// Initialize S3/R2 Client using S3_* variables
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
const PUBLIC_URL_BASE = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    // 1. If S3 Client is configured, try uploading to S3/R2 bucket with automatic bucket retry and local fallback
    if (s3Client && (PRIMARY_BUCKET || SECONDARY_BUCKET)) {
      const bucketsToTry = Array.from(new Set([PRIMARY_BUCKET, SECONDARY_BUCKET].filter(Boolean) as string[]));

      for (const targetBucket of bucketsToTry) {
        try {
          const uploadParams = {
            Bucket: targetBucket,
            Key: `${folder}/${uniqueFileName}`,
            Body: buffer,
            ContentType: file.type,
          };
          await s3Client.send(new PutObjectCommand(uploadParams));

          // Construct file access URL
          let fileUrl = "";
          if (PUBLIC_URL_BASE) {
            const cleanBase = PUBLIC_URL_BASE.trim().replace(/\/$/, "");
            fileUrl = `${cleanBase}/${folder}/${uniqueFileName}`;
          } else if (cleanEndpoint) {
            const rawR2Url = `${cleanEndpoint}/${targetBucket}/${folder}/${uniqueFileName}`;
            if (cleanEndpoint.includes(".r2.cloudflarestorage.com")) {
              fileUrl = `/api/media?url=${encodeURIComponent(rawR2Url)}`;
            } else {
              fileUrl = rawR2Url;
            }
          } else {
            fileUrl = `https://${targetBucket}.s3.${process.env.S3_REGION}.amazonaws.com/${folder}/${uniqueFileName}`;
          }

          if (fileUrl.startsWith("/")) {
            fileUrl = `${req.nextUrl?.origin || "http://localhost:3000"}${fileUrl}`;
          }

          return NextResponse.json({ url: fileUrl, isS3: true, filename: uniqueFileName, bucket: targetBucket });
        } catch (s3Err: any) {
          console.warn(`[api/upload] S3 upload to bucket '${targetBucket}' failed (${s3Err.name || s3Err.Code || s3Err.message}). Trying next or falling back...`);
        }
      }
    }

    // 2. Fallback: Save file locally in public/uploads/ folder if S3 failed or not available
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, uniqueFileName);
    writeFileSync(filePath, buffer);

    let localUrl = `/uploads/${folder}/${uniqueFileName}`;
    if (localUrl.startsWith("/")) {
      localUrl = `${req.nextUrl?.origin || "http://localhost:3000"}${localUrl}`;
    }
    return NextResponse.json({ url: localUrl, isS3: false, filename: uniqueFileName });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const folder = searchParams.get("folder") || "general";

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // 1. If it's an S3/R2 URL, try deleting from bucket
    if (s3Client && (PRIMARY_BUCKET || SECONDARY_BUCKET) && (url.includes("amazonaws.com") || url.includes("cloudflarestorage.com") || (PUBLIC_URL_BASE && url.startsWith(PUBLIC_URL_BASE)))) {
      const parts = url.split("/");
      const fileName = parts.pop();
      if (fileName) {
        const bucketsToTry = Array.from(new Set([PRIMARY_BUCKET, SECONDARY_BUCKET].filter(Boolean) as string[]));
        for (const targetBucket of bucketsToTry) {
          try {
            const deleteParams = {
              Bucket: targetBucket,
              Key: `${folder}/${fileName}`,
            };
            await s3Client.send(new DeleteObjectCommand(deleteParams));
            return NextResponse.json({ success: true, message: "Deleted from S3/R2 storage" });
          } catch (e) {
            // Ignore delete errors and try next or continue
          }
        }
      }
    }

    // 2. Fallback: Delete from local folder
    if (url.startsWith("/uploads/")) {
      const relativePath = url.replace("/uploads/", "");
      const filePath = join(process.cwd(), "public", "uploads", relativePath);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return NextResponse.json({ success: true, message: "Deleted local file" });
      }
    }

    return NextResponse.json({ success: true, message: "File already removed or not found" });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}
