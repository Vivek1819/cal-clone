"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    dates: string[];
    enabled: boolean;
    startTime: string | null;
    endTime: string | null;
  }) => void;
};

export default function DateOverrideModal({ open, onClose, onSave }: Props) {
  if (!open) return null;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

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
    const key = formatDate(date);
    setSelectedDates((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  }

  function isPastDate(date: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  const days = getCalendarDays(currentMonth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-neutral-900 border border-neutral-800/50 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* LEFT — Calendar */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-neutral-800/50 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-6">
            Select the dates to override
          </h3>

          {/* Month Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-base font-medium text-neutral-200">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <div className="flex gap-2">
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
                className="p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all text-neutral-300"
              >
                <ChevronLeft className="w-4 h-4" />
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
                className="p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all text-neutral-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold text-neutral-500 tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, idx) => {
              if (!date) return <div key={idx} className="h-11" />;

              const key = formatDate(date);
              const selected = selectedDates.includes(key);
              const past = isPastDate(date);

              if (past) {
                return (
                  <div
                    key={idx}
                    className="h-11 flex items-center justify-center text-sm text-neutral-700 font-medium"
                  >
                    {date.getDate()}
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => toggleDate(date)}
                  className={`h-11 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      selected
                        ? "bg-white text-black shadow-lg scale-105"
                        : "bg-neutral-800/50 text-neutral-200 hover:bg-neutral-700 hover:scale-105 border border-neutral-700/30 hover:border-neutral-600"
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Which hours are you free?
            </h3>

            <p className="text-sm text-neutral-400 mb-6">
              {selectedDates.length === 0
                ? "Select dates from the calendar"
                : `${selectedDates.length} date(s) selected`}
            </p>

            {/* Unavailable Toggle */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={unavailable}
                onChange={(e) => setUnavailable(e.target.checked)}
                className="h-4 w-4 accent-white"
              />
              <span className="text-sm text-neutral-200">
                Mark unavailable (all day)
              </span>
            </label>

            {/* Time inputs */}
            {!unavailable && (
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                />
                <span className="text-neutral-400">–</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-neutral-800/50 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
            >
              Close
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
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
