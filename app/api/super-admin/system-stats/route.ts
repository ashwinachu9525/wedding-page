import { NextRequest, NextResponse } from "next/server";
import os from "os";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("vivaha_admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = JSON.parse(atob(sessionCookie));
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!decoded || !decoded.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Since this might run in Vercel Serverless, os metrics reflect the Lambda instance.
    // That's standard for serverless monitoring.
    
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = totalMem ? (usedMem / totalMem) * 100 : 0;

    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    // 1-minute load average divided by number of logical CPUs gives a rough % in Node.js
    const cpuUsagePercent = cpus.length ? (loadAvg[0] / cpus.length) * 100 : 0;

    const memoryStats = {
      usedGB: (usedMem / (1024 ** 3)).toFixed(2),
      totalGB: (totalMem / (1024 ** 3)).toFixed(2),
      percent: Math.min(Math.round(memUsagePercent), 100)
    };

    const cpuStats = {
      cores: cpus.length,
      percent: Math.min(Math.round(cpuUsagePercent), 100)
    };

    return NextResponse.json({
      memory: memoryStats,
      cpu: cpuStats,
      uptime: os.uptime(), // system uptime in seconds
      platform: os.platform()
    });

  } catch (err) {
    console.error("Error fetching system stats:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
