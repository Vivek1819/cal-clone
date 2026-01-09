"use client";

import { ChevronLeft, ChevronRight, Calendar, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    dates: string[];
    enabled: boolean;
    startTime: string | null;
    endTime: string | null;
  }) => void;
  editingOverride?: {
    date: string;
    enabled: boolean;
    startTime: string | null;
    endTime: string | null;
  } | null;
  overriddenDates: string[];
};

export default function DateOverrideModal({
  open,
  onClose,
  onSave,
  editingOverride,
  overriddenDates
}: Props) {
  if (!open) return null;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  useEffect(() => {
    if (editingOverride) {
      setSelectedDates([editingOverride.date]);
      setUnavailable(!editingOverride.enabled);
      setStartTime(editingOverride.startTime ?? "09:00");
      setEndTime(editingOverride.endTime ?? "17:00");
    }
  }, [editingOverride]);

  function getCalendarDays(month: Date) {
    const year = month.getFullYear();
    const m = month.getMonth();

    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, m, d));
    }

    return days;
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  }

  function toggleDate(date: Date) {
    if (editingOverride) return;

    const key = formatDate(date);
    setSelectedDates((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  }

  function isOverriddenDate(date: Date) {
    const key = formatDate(date);

    // Allow selecting the same date while editing
    if (editingOverride && editingOverride.date === key) {
      return false;
    }

    return overriddenDates.includes(key);
  }


  function isPastDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  const days = getCalendarDays(currentMonth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-4xl rounded-xl bg-neutral-950/90 border border-neutral-800/50 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] sm:max-h-[90vh]">
        {/* LEFT — Calendar */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-neutral-800/50 p-4 sm:p-5 lg:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                Select Dates
              </h3>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 mb-4 sm:mb-6">
            Choose dates to override your regular availability
          </p>

          {/* Month Navigation */}
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-base font-semibold text-neutral-200">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-1.5 sm:p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800/50 hover:border-neutral-600 transition text-neutral-300"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-1.5 sm:p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800/50 hover:border-neutral-600 transition text-neutral-300"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div
                key={d}
                className="text-center text-[9px] sm:text-[10px] font-semibold text-neutral-500 tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((date, idx) => {
              if (!date) return <div key={idx} className="h-9 sm:h-10 lg:h-11" />;

              const key = formatDate(date);
              const selected = selectedDates.includes(key);
              const past = isPastDate(date);
              const overridden = isOverriddenDate(date);
              const isToday = formatDate(date) === formatDate(new Date());

              if (past || overridden) {
                return (
                  <div
                    key={idx}
                    className="h-9 sm:h-10 lg:h-11 flex items-center justify-center text-xs sm:text-sm text-neutral-700 font-medium"
                  >
                    {date.getDate()}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => toggleDate(date)}
                  className={`h-9 sm:h-10 lg:h-11 rounded-lg text-xs sm:text-sm font-medium transition-all relative
                    ${
                      selected
                        ? "bg-white text-black shadow-lg"
                        : "bg-neutral-800/40 text-neutral-200 hover:bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600"
                    }
                    ${isToday && !selected ? "ring-1 ring-neutral-600" : ""}
                    ${overridden ? "cursor-not-allowed opacity-50" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="w-full md:w-1/2 p-4 sm:p-5 lg:p-8 flex flex-col bg-neutral-900/50 overflow-y-auto">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                Set Hours
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 mb-5 sm:mb-6">
              {selectedDates.length === 0 ? (
                "Select dates from the calendar"
              ) : (
                <span className="text-neutral-200 font-medium">
                  {selectedDates.length} date{selectedDates.length > 1 ? "s" : ""} selected
                </span>
              )}
            </p>

            {/* Unavailable Toggle */}
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-neutral-800/30 border border-neutral-700/50 rounded-lg">
              <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer group">
                <div className="relative flex items-center flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={unavailable}
                    onChange={(e) => setUnavailable(e.target.checked)}
                    className="peer h-4 w-4 sm:h-5 sm:w-5 rounded border-2 border-neutral-600 bg-neutral-800 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-white/20 transition cursor-pointer"
                  />
                  <svg
                    className="absolute left-0.5 top-0.5 w-3 h-3 sm:w-4 sm:h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-medium text-neutral-200 block">
                    Mark as unavailable
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-500 block mt-1">
                    Block these dates entirely (no bookings)
                  </span>
                </div>
              </label>
            </div>

            {/* Time inputs */}
            {!unavailable && (
              <div>
                <label className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider block mb-2 sm:mb-3">
                  Available hours
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  />
                  <span className="text-neutral-500 text-sm">–</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 sm:pt-6 border-t border-neutral-800/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 mt-4 sm:mt-0">
            <button
              onClick={onClose}
              className="w-full sm:w-auto rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-neutral-300 hover:bg-neutral-800/50 transition"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                onSave({
                  dates: selectedDates,
                  enabled: !unavailable,
                  startTime: unavailable ? null : startTime,
                  endTime: unavailable ? null : endTime,
                })
              }
              disabled={selectedDates.length === 0}
              className="w-full sm:w-auto rounded-lg bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-white/10"
            >
              Save Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}