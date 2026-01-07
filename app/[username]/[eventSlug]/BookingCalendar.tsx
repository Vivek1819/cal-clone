"use client";

import { useState } from "react";

/* ------------------ helpers ------------------ */

const DAY_KEY_BY_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isPastDate(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function formatDateLabel(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  return `${weekday} ${day}`;
}

/* ------------------ types ------------------ */

type Props = {
  username: string;
  eventType: {
    title: string;
    duration: number;
    slug: string;
  };
  availability: {
    timezone: string;
    [key: string]: any;
  };
};

/* ------------------ component ------------------ */

export default function BookingCalendar({
  username,
  eventType,
  availability,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [use24h, setUse24h] = useState(false);

  function isDateAvailable(date: Date) {
    const dayKey = DAY_KEY_BY_INDEX[date.getDay()];
    const enabled = availability[`${dayKey}Enabled`];
    return Boolean(enabled) && !isPastDate(date);
  }

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

  function generateTimeSlots() {
    if (!selectedDate) return [];

    const dayKey = DAY_KEY_BY_INDEX[selectedDate.getDay()];
    const start = availability[`${dayKey}Start`];
    const end = availability[`${dayKey}End`];

    if (!start || !end) return [];

    const slots: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    while (h < endH || (h === endH && m < endM)) {
      const date = new Date();
      date.setHours(h, m, 0, 0);

      slots.push(
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: !use24h,
        })
      );

      m += eventType.duration;
      if (m >= 60) {
        h += 1;
        m = 0;
      }
    }

    return slots;
  }

  const days = getCalendarDays(currentMonth);
  const slots = generateTimeSlots();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-neutral-100">
      <div className="flex w-full max-w-7xl h-[600px] rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {/* LEFT PANEL — 25% */}
        <div className="w-1/4 border-r border-neutral-800 p-10 space-y-6">
          <div className="text-sm text-neutral-400">{username}</div>

          <h1 className="text-3xl font-semibold">{eventType.title}</h1>

          <div className="text-sm text-neutral-400">
            ⏱ {eventType.duration} min
          </div>

          <div className="text-sm text-neutral-400">
            🌍 {availability.timezone}
          </div>
        </div>

        {/* CALENDAR — 50% */}
        <div className="w-1/2 p-10 border-r border-neutral-800">
          {/* Month Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-medium">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h1>

            <div className="flex gap-3">
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
                className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800"
              >
                ←
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
                className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800"
              >
                →
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-6 mb-4 text-sm text-neutral-400">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="text-center tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-5">
            {days.map((date, idx) => {
              if (!date) return <div key={idx} />;

              const available = isDateAvailable(date);
              const selected = selectedDate && isSameDay(selectedDate, date);

              return (
                <button
                  key={idx}
                  disabled={!available}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className={`
                    h-16 w-full rounded-xl text-lg font-medium transition
                    ${
                      selected
                        ? "bg-white text-black"
                        : available
                        ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                        : "bg-neutral-900 text-neutral-600 cursor-not-allowed"
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIME SLOTS — 25% */}
        <div className="w-1/4 p-10 flex flex-col h-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between flex-shrink-0">
            <div className="text-sm font-medium">
              {selectedDate ? formatDateLabel(selectedDate) : "Select a time"}
            </div>

            <div className="inline-flex rounded-lg border border-neutral-800 overflow-hidden">
              <button
                onClick={() => setUse24h(false)}
                className={`px-4 py-1 text-sm ${
                  !use24h ? "bg-neutral-800" : "text-neutral-400"
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setUse24h(true)}
                className={`px-4 py-1 text-sm ${
                  use24h ? "bg-neutral-800" : "text-neutral-400"
                }`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Scrollable slot list */}
          {!selectedDate ? (
            <div className="text-neutral-500 text-sm">Select a date first</div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
              {slots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`
          flex items-center justify-center gap-3
          rounded-lg border px-4 py-3 cursor-pointer transition
          ${
            selectedTime === slot
              ? "border-white bg-neutral-800"
              : "border-neutral-800 hover:border-neutral-600"
          }
        `}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm">{slot}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
