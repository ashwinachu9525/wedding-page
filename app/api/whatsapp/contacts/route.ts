import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient()!;
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user || !user.whatsappSessionId) {
      return NextResponse.json({ error: "WhatsApp session not linked", contacts: [] }, { status: 400 });
    }

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (!openWaUrl) {
      return NextResponse.json({ error: "OPENWA_SERVER_URL is not configured", contacts: [] }, { status: 500 });
    }

    const headers = {
      "Content-Type": "application/json",
      ...(openWaKey ? { "X-API-Key": openWaKey } : {}),
    };

    let activeSessionId = user.whatsappSessionId.replace(/_/g, "-");
    try {
      const checkRes = await fetch(`${openWaUrl}/api/sessions/${activeSessionId}`, { method: "GET", headers });
      if (!checkRes.ok) {
        const listRes = await fetch(`${openWaUrl}/api/sessions`, { method: "GET", headers });
        if (listRes.ok) {
          const sessions = await listRes.json();
          if (Array.isArray(sessions)) {
            const matched = sessions.find((s: any) => s.id === activeSessionId || s.name === activeSessionId || s.name === `user-${user.id}`);
            if (matched) {
              activeSessionId = matched.id;
              await prisma.user.update({ where: { id: user.id }, data: { whatsappSessionId: activeSessionId } }).catch(() => {});
            }
          }
        }
      }
    } catch (e) {
      console.warn("Self-heal session check error:", e);
    }

    const contactsRes = await fetch(`${openWaUrl}/api/sessions/${activeSessionId}/contacts?limit=1000`, {
      method: "GET",
      headers,
    });

    if (!contactsRes.ok) {
      const errText = await contactsRes.text();
      console.warn("OpenWA contacts fetch failed:", contactsRes.status, errText);
      return NextResponse.json({
        contacts: [],
        warning: "Contacts list is not supported or not yet synced in this WhatsApp engine instance.",
      });
    }

    const rawContacts = await contactsRes.json();
    const contactsArray = Array.isArray(rawContacts) ? rawContacts : [];
    // De-duplicate contacts by unique id or cleaned phone number
    const seen = new Set();
    const uniqueContacts = contactsArray.filter((c: any) => {
      const key = c.id || c.number || Math.random().toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({
      contacts: uniqueContacts,
    });
  } catch (error: any) {
    console.error("Fetch WhatsApp contacts error:", error);
    return NextResponse.json({ error: "Internal server error", contacts: [] }, { status: 500 });
  }
}
