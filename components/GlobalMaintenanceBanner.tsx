"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Bell } from "lucide-react";

export function GlobalMaintenanceBanner() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceText, setMaintenanceText] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState("");
  
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [alertText, setAlertText] = useState("");

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const res = await fetch("/api/system-config", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.config) {
          setMaintenanceMode(data.config.maintenanceMode);
          setMaintenanceText(data.config.maintenanceText || "");
          setMaintenanceDate(data.config.maintenanceDate || "");
          setAlertEnabled(data.config.alertEnabled);
          setAlertText(data.config.alertText || "");
        }
      } catch (e) {
        console.error("Failed to fetch maintenance status", e);
      }
    };

    // Initial check
    fetchMaintenanceStatus();
    
    // Custom event for same-tab updates (from Super Admin)
    window.addEventListener("vivaha_maintenance_updated", fetchMaintenanceStatus);

    return () => {
      window.removeEventListener("vivaha_maintenance_updated", fetchMaintenanceStatus);
    };
  }, []);

  if (!maintenanceMode && !alertEnabled) return null;

  return (
    <div className="flex flex-col w-full sticky top-0 z-50 shadow-md">
      {alertEnabled && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2.5 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-2 w-full">
          <Bell className="w-4 h-4 shrink-0" />
          <div className="text-center sm:text-left text-xs font-bold tracking-wide">
            {alertText}
          </div>
        </div>
      )}
      
      {maintenanceMode && (
        <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 w-full">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-center sm:text-left text-sm font-semibold tracking-wide">
            {maintenanceText}
            {maintenanceDate && ` on ${new Date(maintenanceDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
          </div>
        </div>
      )}
    </div>
  );
}
