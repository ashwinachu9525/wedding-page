"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface SessionUser {
  id?: string;
  email: string;
  name?: string | null;
  role?: string;
  provider?: string;
  slug?: string | null;
  coupleNames?: string | null;
  venueName?: string | null;
  weddingDate?: string | null;
  onboarded?: boolean;
  isDemo?: boolean;
  isSuperAdmin?: boolean;
  partnerUserId?: string | null;
  partnerEmail?: string | null;
  partnerUser?: { name?: string | null; email?: string | null } | null;
}

interface UseSessionReturn {
  user: SessionUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" });
    } catch {}
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  return { user, loading, logout, refresh };
}
