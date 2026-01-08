"use client";

import { Video } from "lucide-react";
import { cancelBooking } from "./actions";
import { use, useState } from "react";
import { useRouter } from "next/navigation";

/* ------------------ Types ------------------ */

type Booking = {
  id: string;
  name: string;
  email: string;
  date: Date;
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

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-100">Bookings</h1>
        <p className="text-sm text-neutral-400 mt-2">
          See upcoming and past events booked through your event type links.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <Tab
          label="Upcoming"
          active={tab === "UPCOMING"}
          onClick={() => setTab("UPCOMING")}
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

      {/* List */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-sm text-neutral-400">
            No bookings found.
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
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
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
      }`}
    >
      {label}
    </button>
  );
}


function BookingRow({ booking }: { booking: Booking }) {
  const date = new Date(booking.date);
  const endDateTime = getBookingEndDateTime(booking);
  const isUpcoming = endDateTime > new Date();

  const router = useRouter();

  async function handleCancel() {
    if (!confirm("Cancel this booking?")) return;
    await cancelBooking(booking.id);
    router.refresh(); 
  }

  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800 last:border-b-0">
      {/* Left */}
      <div className="w-56">
        <div className="text-base font-medium text-neutral-100">
          {date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        </div>
        <div className="text-sm text-neutral-400 mt-1">
          {booking.startTime} – {booking.endTime}
        </div>
        <div className="flex items-center gap-1 text-sm text-blue-400 mt-2">
          <Video size={14} />
          <span>Join Cal Video</span>
        </div>
      </div>

      {/* Middle */}
      <div className="flex-1 px-6">
        <div className="text-base font-medium text-neutral-100">
          {booking.eventType.title}
        </div>
        <div className="text-sm text-neutral-400">You and {booking.name}</div>
      </div>

      {/* Right */}
      {booking.status === "BOOKED" &&
        isUpcoming && (
          <button
            onClick={handleCancel}
            className="text-sm px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
          >
            Cancel
          </button>
        )}
    </div>
  );
}
