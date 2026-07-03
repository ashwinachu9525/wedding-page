import { MetadataRoute } from "next";
import { getPrismaClient } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://vivahaluxe.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic invitation pages — only published ones
  let invitationRoutes: MetadataRoute.Sitemap = [];
  const prisma = getPrismaClient();
  
  if (prisma) {
    try {
      const invitations = await prisma.invitation.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      });

      invitationRoutes = invitations.map((inv) => ({
        url: `${BASE_URL}/invite/${inv.slug}`,
        lastModified: inv.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch (error) {
      console.error("Sitemap: failed to fetch invitations", error);
    }
  }

  return [...staticRoutes, ...invitationRoutes];
}
