import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });

    let config = await prisma.systemConfig.findUnique({
      where: { id: "global" }
    });

    if (!config) {
      config = await prisma.systemConfig.create({
        data: {
          id: "global",
          maintenanceMode: false,
          maintenanceText: "",
          maintenanceDate: "",
          alertEnabled: false,
          alertText: ""
        }
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("[SystemConfig GET] Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });

    // Basic super admin cookie check can be performed here, but keeping it simple for now
    const body = await req.json();
    const { maintenanceMode, maintenanceText, maintenanceDate, alertEnabled, alertText } = body;

    const updatedConfig = await prisma.systemConfig.upsert({
      where: { id: "global" },
      update: {
        maintenanceMode,
        maintenanceText,
        maintenanceDate,
        alertEnabled,
        alertText
      },
      create: {
        id: "global",
        maintenanceMode,
        maintenanceText,
        maintenanceDate,
        alertEnabled,
        alertText
      }
    });

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error) {
    console.error("[SystemConfig POST] Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
