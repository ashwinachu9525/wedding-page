"use client";

import React from "react";
import { formatHeadingText } from "@/lib/fonts";

interface CoupleNameProps {
  names?: string;
  headingType?: "script" | "serif" | "modern" | "classic" | string | any;
  multiLine?: boolean;
  splitAmpersand?: boolean;
  className?: string;
}

export function CoupleNameDisplay({
  names = "",
  headingType,
  multiLine = true,
  splitAmpersand = false,
  className = "",
}: CoupleNameProps) {
  if (!names) return null;

  // 1. Normalize line breaks E.g. convert <br>, <br/>, \\n, \r\n into \n
  let normalized = names
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");

  // 2. If splitAmpersand is enabled, ensure ampersand or 'and' is stacked on a separate line
  if (splitAmpersand) {
    if (normalized.includes("&")) {
      const parts = normalized.split("&").map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        normalized = parts.join("\n&\n");
      }
    } else if (/\band\b/i.test(normalized)) {
      const parts = normalized.split(/\band\b/i).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        normalized = parts.join("\n&\n");
      }
    }
  }

  // 3. If multiLine is false (e.g., for Navbar top bar), flatten all \n into spaces
  if (!multiLine) {
    const flatText = normalized.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
    const formatted = formatHeadingText(flatText, headingType);
    return <span className={className}>{formatted}</span>;
  }

  // 4. If multiLine is true, split by \n and render each line inside a responsive flex container
  const lines = normalized.split("\n").map(l => l.trim()).filter(Boolean);

  if (lines.length <= 1) {
    // Single line
    const formatted = formatHeadingText(lines[0] || names, headingType);
    return <span className={className}>{formatted}</span>;
  }

  return (
    <span className={`flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3 text-center ${className}`}>
      {lines.map((line, idx) => {
        const formattedLine = formatHeadingText(line, headingType);
        const isAmpersand = line === "&" || line.toLowerCase() === "and";
        return (
          <span
            key={idx}
            className={`block ${
              isAmpersand
                ? headingType === "script"
                  ? "text-[0.65em] opacity-85 my-0.5 sm:my-1"
                  : "text-[0.55em] opacity-75 my-0 sm:my-1 tracking-widest"
                : "leading-tight"
            }`}
          >
            {formattedLine}
          </span>
        );
      })}
    </span>
  );
}
