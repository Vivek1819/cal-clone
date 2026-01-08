"use client";

import { Video, Clock, User } from "lucide-react";
import { useState } from "react";
import { cancelBooking } from "./actions";
import { useRouter } from "next/navigation";

/* ------------------ Types ------------------ */

type Booking = {
  id: string;
  name: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  eventType: {
    title: string;
    duration: number;
  };
};

type TabType = "UPCOMING" | "PAST" | "CANCELLED";

function getBookingEndDateTime(booking: Booking) {
  const date = new Date(booking.date);

  const [time, meridian] = booking.endTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

export default function BookingsClient({ bookings }: { bookings: Booking[] }) {
  const [tab, setTab] = useState<TabType>("UPCOMING");
  const router = useRouter();

  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const endDateTime = getBookingEndDateTime(booking);

    if (tab === "UPCOMING") {
      return booking.status === "BOOKED" && endDateTime > now;
    }

    if (tab === "PAST") {
      return booking.status === "BOOKED" && endDateTime <= now;
    }

    if (tab === "CANCELLED") {
      return booking.status === "CANCELLED";
    }

    return false;
  });

  async function handleCancel(bookingId: string) {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(bookingId);
    router.refresh();
  }

  const upcomingCount = bookings.filter(b => {
    const endDateTime = getBookingEndDateTime(b);
    return b.status === "BOOKED" && endDateTime > now;
  }).length;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100">
          Bookings
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400">
          See upcoming and past events booked through your event type links.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 sm:mb-8 border-b border-neutral-800/50">
        <Tab
          label="Upcoming"
          active={tab === "UPCOMING"}
          onClick={() => setTab("UPCOMING")}
          count={upcomingCount}
        />
        <Tab
          label="Past"
          active={tab === "PAST"}
          onClick={() => setTab("PAST")}
        />
        <Tab
          label="Cancelled"
          active={tab === "CANCELLED"}
          onClick={() => setTab("CANCELLED")}
        />
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm p-12 text-center">
            <p className="text-sm text-neutral-400">No bookings found.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingRow 
              key={booking.id} 
              booking={booking} 
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
  count
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-4 text-sm font-medium transition-colors ${
        active
          ? "text-white"
          : "text-neutral-400 hover:text-neutral-200"
      }`}
    >
      <span className="flex items-center gap-2">
        {label}
        {count !== undefined && count > 0 && (
          <span className={`text-sm transition-colors ${
            active ? "text-neutral-400" : "text-neutral-500"
          }`}>
            {count}
          </span>
        )}
      </span>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
      )}
    </button>
  );
}

function BookingRow({ 
  booking, 
  onCancel 
}: { 
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  const date = new Date(booking.date);
  const endDateTime = getBookingEndDateTime(booking);
  const isUpcoming = endDateTime > new Date();

  return (
    <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 hover:border-neutral-700/50 transition-all duration-200 backdrop-blur-sm">
      {/* Mobile & Tablet Layout */}
      <div className="flex flex-col gap-4 p-4 sm:p-5 md:hidden">
        {/* Top Row: Date Badge + Day/Time */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-md bg-neutral-800 border border-neutral-700/50 flex flex-col items-center justify-center">
              <div className="text-[9px] font-medium text-neutral-400 uppercase tracking-wide">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </div>
              <div className="text-lg font-bold text-white leading-none mt-0.5">
                {date.getDate()}
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-1.5">
            <div className="text-sm font-medium text-white">
              {date.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Clock size={14} />
              <span>{booking.startTime} – {booking.endTime}</span>
            </div>
            {booking.status === "BOOKED" && (
              <a 
                href="#"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Video size={14} />
                <span>Join Cal Video</span>
              </a>
            )}
          </div>

          {booking.status === "BOOKED" && isUpcoming && (
            <button
              onClick={() => onCancel(booking.id)}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Bottom Row: Event Details */}
        <div className="flex items-start justify-between gap-4 pl-16">
          <div className="flex-1 space-y-1">
            <div className="text-sm font-medium text-white">
              {booking.eventType.title}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <User size={14} />
              <span>You and {booking.name}</span>
            </div>
          </div>
          <div className="inline-block px-2 py-0.5 text-[11px] text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 rounded whitespace-nowrap">
            {booking.eventType.duration} min
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-6 p-5 lg:p-6">
        {/* Date Badge */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-md bg-neutral-800 border border-neutral-700/50 flex flex-col items-center justify-center">
            <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
              {date.toLocaleDateString("en-US", { month: "short" })}
            </div>
            <div className="text-xl font-bold text-white leading-none mt-0.5">
              {date.getDate()}
            </div>
          </div>
        </div>

        {/* Left Section: Day, Time, and Video Link */}
        <div className="flex-shrink-0 space-y-2 w-40">
          <div className="text-base font-medium text-white">
            {date.toLocaleDateString("en-US", { weekday: "long" })}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <Clock size={14} />
            <span>{booking.startTime} – {booking.endTime}</span>
          </div>
          {booking.status === "BOOKED" && (
            <a 
              href="#"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Video size={14} />
              <span>Join Cal Video</span>
            </a>
          )}
        </div>

        {/* Middle Section: Event Title and Participants */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-base font-medium text-white">
            {booking.eventType.title}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <User size={14} />
            <span>You and {booking.name}</span>
          </div>
          <div className="inline-block px-2.5 py-0.5 text-xs text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 rounded">
            {booking.eventType.duration} min
          </div>
        </div>

        {/* Right Section: Cancel Button */}
        {booking.status === "BOOKED" && isUpcoming && (
          <div className="flex-shrink-0">
            <button
              onClick={() => onCancel(booking.id)}
              className="px-4 py-2 text-sm font-medium rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}