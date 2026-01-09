"use client";

import { useState, useEffect } from "react";
import BookingForm from "./booking/BookingForm";
import {
  createBooking,
  getBookedSlotsForDate,
  getDateAvailability,
} from "./booking/actions";
import BookingConfirm from "./BookingConfirm";
import { Clock, Globe, ChevronLeft, ChevronRight } from "lucide-react";

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

type Props = {
  username: string;
  eventType: {
    id: string;
    title: string;
    duration: number;
    slug: string;
    buffer: number;
  };
  availability: {
    timezone: string;
    [key: string]: any;
  };
};

export default function BookingCalendar({
  username,
  eventType,
  availability,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [use24h, setUse24h] = useState(false);

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    name: string;
    email: string;
    endTime: string;
  } | null>(null);

  const [bookedSlots, setBookedSlots] = useState<
    {
      startTime: string;
      endTime: string;
      eventType: {
        duration: number;
        buffer: number;
      };
    }[]
  >([]);

  const [dateAvailability, setDateAvailability] = useState<{
    blocked: boolean;
    startTime: string | null;
    endTime: string | null;
  } | null>(null);

  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadBlockedDates() {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      const res = await fetch(
        `/api/date-overrides?year=${year}&month=${month}`
      );
      const data: { date: string; enabled: boolean }[] = await res.json();

      setBlockedDates(
        new Set(data.filter((d) => !d.enabled).map((d) => d.date))
      );
    }

    loadBlockedDates();
  }, [currentMonth]);

  if (bookingConfirmed && bookingDetails && selectedDate && selectedTime) {
    return (
      <BookingConfirm
        eventTitle={eventType.title}
        hostName={username}
        guestName={bookingDetails.name}
        guestEmail={bookingDetails.email}
        dateLabel={selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        timeRange={`${selectedTime} – ${bookingDetails.endTime}`}
        timezone={availability.timezone}
      />
    );
  }

  if (selectedDate && selectedTime) {
    return (
      <BookingForm
        username={username}
        eventTitle={eventType.title}
        duration={eventType.duration}
        dateLabel={selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        timeLabel={selectedTime}
        timezone={availability.timezone}
        onBack={() => setSelectedTime(null)}
        onConfirm={async ({ name, email }) => {
          const startTime = selectedTime!;
          const start = new Date(`1970-01-01 ${startTime}`);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + eventType.duration);
          const endTime = end.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const dateOnly = selectedDate!.toLocaleDateString("en-CA");

          await createBooking({
            name,
            email,
            date: dateOnly,
            startTime,
            endTime: end.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            eventTypeId: eventType.id,
          });
          setBookingDetails({ name, email, endTime });
          setBookingConfirmed(true);
        }}
      />
    );
  }

  function isWeeklyAvailable(date: Date) {
    const dayKey = DAY_KEY_BY_INDEX[date.getDay()];
    return Boolean(availability[`${dayKey}Enabled`]) && !isPastDate(date);
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

  function toMinutes(time: string) {
    const date = new Date(`1970-01-01 ${time}`);
    return date.getHours() * 60 + date.getMinutes();
  }

  function generateTimeSlots() {
    if (!selectedDate) return [];

    const dayKey = DAY_KEY_BY_INDEX[selectedDate.getDay()];
    let start = availability[`${dayKey}Start`];
    let end = availability[`${dayKey}End`];

    if (dateAvailability?.startTime && dateAvailability?.endTime) {
      start = dateAvailability.startTime;
      end = dateAvailability.endTime;
    }

    if (dateAvailability && dateAvailability.blocked) {
      return [];
    }

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

  const availableSlots = slots.filter((slot) => {
    const slotStart = toMinutes(slot);
    const slotEnd = slotStart + eventType.duration;

    return !bookedSlots.some((booking) => {
      const buffer = booking.eventType.buffer ?? 0;

      const bookingStart = toMinutes(booking.startTime) - buffer;

      const bookingEnd = toMinutes(booking.endTime) + buffer;

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-950 to-black text-neutral-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl lg:h-[640px] rounded-xl border border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* LEFT PANEL — Info section */}
        <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-neutral-800/50 p-6 lg:p-10 space-y-6 bg-neutral-900/30">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Host
            </div>
            <div className="text-base text-neutral-300">{username}</div>
          </div>

          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
              Event Type
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold text-neutral-100">
              {eventType.title}
            </h1>
          </div>

          <div className="pt-4 space-y-4 border-t border-neutral-800/50">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500">Duration</div>
                <div className="text-sm text-neutral-200">
                  {eventType.duration} minutes
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-neutral-400 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500">Timezone</div>
                <div className="text-sm text-neutral-200">
                  {availability.timezone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR — Main calendar section */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-neutral-800/50 overflow-y-auto lg:overflow-visible">
          {/* Month Header */}
          <div className="mb-6 lg:mb-8 flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>

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
                className="p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800/50 transition"
                aria-label="Previous month"
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
                className="p-2 rounded-lg border border-neutral-700/50 hover:bg-neutral-800/50 transition"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4 text-xs font-medium text-neutral-500">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="text-center tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2 lg:gap-4">
            {days.map((date, idx) => {
              if (!date) return <div key={idx} />;

              const available = isWeeklyAvailable(date);
              const selected = selectedDate && isSameDay(selectedDate, date);
              const isToday = isSameDay(date, new Date());

              const dateKey = date.toLocaleDateString("en-CA");
              const blockedByOverride = blockedDates.has(dateKey);

              return (
                <button
                  key={idx}
                  disabled={!available || blockedByOverride}
                  onClick={async () => {
                    if (blockedByOverride) return;
                    setSelectedDate(date);
                    setSelectedTime(null);
                    
                    setDateAvailability(null);
                    const availabilityForDate = await getDateAvailability({
                      date: dateKey,
                    });
                    setDateAvailability(availabilityForDate);

                    if (availabilityForDate.blocked) {
                      setBookedSlots([]);
                      return;
                    }
                    const booked = await getBookedSlotsForDate({
                      date: dateKey,
                    });
                    setBookedSlots(booked);
                  }}
                  className={`
                    h-12 sm:h-14 lg:h-14 w-full rounded-lg text-sm lg:text-base font-medium transition relative
                    ${
                      selected
                        ? "bg-white text-black shadow-lg"
                        : available
                        ? "bg-neutral-800/50 text-neutral-200 hover:bg-neutral-700/50 border border-neutral-700/30"
                        : "bg-transparent text-neutral-700 cursor-not-allowed"
                    }
                    ${isToday && !selected ? "ring-1 ring-neutral-600" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIME SLOTS — Right panel */}
        <div className="w-full lg:w-1/4 p-6 lg:p-10 flex flex-col max-h-[400px] lg:max-h-full lg:h-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between flex-shrink-0">
            <div className="text-sm font-semibold">
              {selectedDate ? formatDateLabel(selectedDate) : "Select date"}
            </div>

            <div className="inline-flex rounded-lg border border-neutral-700/50 overflow-hidden bg-neutral-900/50">
              <button
                onClick={() => setUse24h(false)}
                className={`px-3 py-1 text-xs transition ${
                  !use24h
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setUse24h(true)}
                className={`px-3 py-1 text-xs transition ${
                  use24h
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Scrollable slot list */}
          {!selectedDate ? (
            <div className="flex items-center justify-center h-full text-sm text-neutral-500">
              Select a date to see available times
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-neutral-500">
              No available times on this date
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`
                    w-full flex items-center justify-center gap-2
                    rounded-lg border px-4 py-3 cursor-pointer transition
                    ${
                      selectedTime === slot
                        ? "border-white bg-white text-black shadow-lg"
                        : "border-neutral-700/50 bg-neutral-800/30 hover:bg-neutral-700/50 hover:border-neutral-600"
                    }
                  `}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      selectedTime === slot
                        ? "bg-emerald-500"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-sm font-medium">{slot}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
