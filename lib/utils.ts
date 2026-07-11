import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Converts direct S3/R2 private storage URLs to our proxy/streaming URL so audio and images load in browsers without CORS/SigV4 issues
export function getPlayableMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.includes(".r2.cloudflarestorage.com/")) {
    return `/api/media?url=${encodeURIComponent(url)}`;
  }
  return url;
}
