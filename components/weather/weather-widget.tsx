"use client";

import React, { useEffect, useState } from "react";
import { CloudRain, Thermometer, Sparkles, Compass, AlertCircle } from "lucide-react";

interface WeatherWidgetProps {
  venueName?: string;
  weddingDate?: string;
  accentClass?: string;
}

interface WeatherData {
  success: boolean;
  location: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  rainChance: number;
  label: string;
  icon: string;
  advice: string;
  isLiveForecast?: boolean;
  isClimateExpectation?: boolean;
}

export function WeatherWidget({
  venueName = "Bangalore",
  weddingDate = "2026-11-21T10:30:00",
  accentClass = "text-[#D4AF37]",
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/weather/forecast?venue=${encodeURIComponent(venueName)}&date=${encodeURIComponent(weddingDate)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success) {
            setWeather(data);
          }
        }
      } catch (err) {
        console.warn("[WeatherWidget] Failed to load forecast:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [venueName, weddingDate]);

  if (loading) {
    return (
      <div className="rounded-sm bg-current/5 border border-current/15 p-6 animate-pulse flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-current/10 rounded" />
          <div className="h-6 w-48 bg-current/10 rounded" />
        </div>
        <div className="h-12 w-12 rounded-full bg-current/10" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="rounded-sm bg-current/5 border border-current/15 overflow-hidden transition-all duration-300 hover:border-current/30">
      {/* Top Banner with Location and Outlook Type */}
      <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-current/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-3.5 h-3.5 ${accentClass}`} />
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accentClass}`}>
              {weather.isLiveForecast ? "Live 16-Day Satellite Forecast" : "Seasonal Climate Outlook"}
            </span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-light">
            Wedding Day Weather: <span className="font-medium">{weather.location}</span>
          </h4>
        </div>

        {/* Temperature Badge */}
        <div className="flex items-center gap-3 bg-current/[0.04] border border-current/15 px-4 py-2.5 rounded-sm shrink-0">
          <span className="text-3xl select-none">{weather.icon}</span>
          <div>
            <div className="text-xs font-bold font-serif">{weather.label}</div>
            <div className="flex items-center gap-3 text-[11px] opacity-80 mt-0.5">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> High: <strong>{weather.maxTemp}°C</strong> / Low: <strong>{weather.minTemp}°C</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CloudRain className="w-3 h-3" /> Rain: <strong>{weather.rainChance}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attire & Travel Recommendation Bar */}
      <div className="p-4 sm:p-5 bg-current/[0.02] flex items-start sm:items-center gap-3 text-xs opacity-90">
        <Compass className={`w-4 h-4 shrink-0 mt-0.5 sm:mt-0 ${accentClass}`} />
        <div>
          <strong className="uppercase tracking-wider text-[10px] opacity-70 block sm:inline mr-2">Attire &amp; Travel Guide:</strong>
          <span>{weather.advice}</span>
        </div>
      </div>
    </div>
  );
}
