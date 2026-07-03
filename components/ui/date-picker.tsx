"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface WeddingDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
  placeholder?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function WeddingDatePicker({ value, onChange, placeholder = "Select wedding date" }: WeddingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date or default to December 2026
  const parsedDate = value ? new Date(value + "T00:00:00") : new Date(2026, 11, 14);
  const selectedYear = !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : 2026;
  const selectedMonth = !isNaN(parsedDate.getTime()) ? parsedDate.getMonth() : 11;
  const selectedDay = !isNaN(parsedDate.getTime()) ? parsedDate.getDate() : 14;

  const [viewYear, setViewYear] = useState(selectedYear);
  const [viewMonth, setViewMonth] = useState(selectedMonth);

  useEffect(() => {
    if (value) {
      const d = new Date(value + "T00:00:00");
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate year options (e.g. 2024 to 2035)
  const years = Array.from({ length: 15 }, (_, i) => 2024 + i);

  // Calculate days in current view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const formattedDisplay = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Shadcn-style Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xs border text-xs sm:text-sm transition-all font-medium text-left ${
          isOpen
            ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30 bg-black/60 text-white"
            : "border-white/20 bg-black/50 text-white hover:border-white/40"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
          <span>{formattedDisplay}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded">
          Change Date
        </span>
      </button>

      {/* Popover Calendar with Dropdown Caption Layout */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-[#2A2723] border border-[#D4AF37]/40 rounded-sm shadow-2xl w-full sm:w-80 text-white animate-fade-in left-0">
          {/* Header with Dropdown Caption Layout */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white/10 rounded text-[#C4B7A6] hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-[#1F1D1A] border border-white/20 rounded px-2 py-1 text-xs font-semibold text-white focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="bg-[#1F1D1A] border border-white/20 rounded px-2 py-1 text-xs font-semibold text-white focus:outline-hidden focus:border-[#D4AF37] cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white/10 rounded text-[#C4B7A6] hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#888178] mb-2">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isSelected =
                viewYear === selectedYear &&
                viewMonth === selectedMonth &&
                day === selectedDay;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-8 w-8 rounded text-xs font-medium flex items-center justify-center transition-all mx-auto ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#1F1D1A] font-bold shadow-md scale-105"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
              }}
              className="text-[#D4AF37] hover:underline font-medium"
            >
              Jump to Current Month
            </button>
            <span className="text-[#888178] text-[10px]">Shadcn Dropdown Layout</span>
          </div>
        </div>
      )}
    </div>
  );
}
