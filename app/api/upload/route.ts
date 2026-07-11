import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { writeFileSync, mkdirSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

// Initialize S3/R2 Client using S3_* variables
const s3Client =
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_REGION
    ? new S3Client({
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT || undefined,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      })
    : null;

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
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

    // 1. If S3 Client is configured, upload to S3/R2 bucket
    if (s3Client && BUCKET_NAME) {
      const uploadParams = {
        Bucket: BUCKET_NAME,
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
      } else if (process.env.S3_ENDPOINT) {
        const cleanEndpoint = process.env.S3_ENDPOINT.trim().replace(/\/$/, "");
        if (cleanEndpoint.includes("r2.cloudflarestorage.com")) {
          // Cloudflare R2 endpoints have the bucket in the path or subdomain
          fileUrl = `${cleanEndpoint}/${folder}/${uniqueFileName}`;
        } else {
          fileUrl = `${cleanEndpoint}/${BUCKET_NAME}/${folder}/${uniqueFileName}`;
        }
      } else {
        fileUrl = `https://${BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${folder}/${uniqueFileName}`;
      }

      return NextResponse.json({ url: fileUrl, isS3: true, filename: uniqueFileName });
    }

    // 2. Fallback: Save file locally in public/uploads/ folder
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, uniqueFileName);
    writeFileSync(filePath, buffer);

    const localUrl = `/uploads/${folder}/${uniqueFileName}`;
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

    // 1. If it's an S3/R2 URL, delete from bucket
    if (s3Client && BUCKET_NAME && (url.includes("amazonaws.com") || url.includes("cloudflarestorage.com") || (PUBLIC_URL_BASE && url.startsWith(PUBLIC_URL_BASE)))) {
      const parts = url.split("/");
      const fileName = parts.pop();
      if (fileName) {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Key: `${folder}/${fileName}`,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        return NextResponse.json({ success: true, message: "Deleted from S3/R2 storage" });
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
