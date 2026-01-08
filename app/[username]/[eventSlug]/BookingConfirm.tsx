"use client";

import { CheckCircle, ExternalLink, Calendar, Clock, Users, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  eventTitle: string;
  hostName: string;
  guestName: string;
  guestEmail: string;
  dateLabel: string;
  timeRange: string;
  timezone: string;
  location?: string;
};

export default function BookingConfirm({
  eventTitle,
  hostName,
  guestName,
  guestEmail,
  dateLabel,
  timeRange,
  timezone,
  location = "Cal Video",
}: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-neutral-100 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-2xl rounded-xl sm:rounded-2xl border border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm shadow-2xl">

        {/* ---------- HEADER ---------- */}
        <div className="flex flex-col items-center text-center px-6 sm:px-8 lg:px-12 pt-8 sm:pt-10 lg:pt-12">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 sm:mb-6">
            <CheckCircle className="text-emerald-400" size={32} strokeWidth={2} />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3">
            Meeting Confirmed!
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-md leading-relaxed">
            Your meeting has been successfully scheduled. All details have been sent to your email.
          </p>
        </div>

        <div className="my-8 sm:my-10 border-t border-neutral-800/50" />

        {/* ---------- DETAILS ---------- */}
        <div className="px-6 sm:px-8 lg:px-12 space-y-6">
          <DetailRow
            icon={<Calendar className="w-5 h-5 text-neutral-400" />}
            label="Event"
            value={eventTitle}
          />

          <DetailRow
            icon={<Clock className="w-5 h-5 text-neutral-400" />}
            label="When"
            value={
              <>
                <div className="font-medium text-neutral-100">{dateLabel}</div>
                <div className="text-sm text-neutral-400 mt-1">{timeRange}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{timezone}</div>
              </>
            }
          />

          <DetailRow
            icon={<Users className="w-5 h-5 text-neutral-400" />}
            label="Participants"
            value={
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-neutral-100">
                    {hostName}
                    <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Host
                    </span>
                  </div>
                  <div className="text-sm text-neutral-400 mt-1">{guestEmail}</div>
                </div>

                <div>
                  <div className="font-medium text-neutral-100">{guestName}</div>
                  <div className="text-sm text-neutral-400 mt-1">{guestEmail}</div>
                </div>
              </div>
            }
          />

          <DetailRow
            icon={<MapPin className="w-5 h-5 text-neutral-400" />}
            label="Location"
            value={
              <a 
                href="#" 
                className="inline-flex items-center gap-1.5 text-neutral-100 hover:text-white transition group"
              >
                <span>{location}</span>
                <ExternalLink size={14} className="text-neutral-400 group-hover:text-neutral-300" />
              </a>
            }
          />
        </div>

        <div className="my-8 sm:my-10 border-t border-neutral-800/50" />

        {/* ---------- FOOTER ---------- */}
        <div className="px-6 sm:px-8 lg:px-12 pb-8 sm:pb-10 flex flex-col items-center gap-5">
          <div className="text-sm text-neutral-400 text-center">
            Need to make changes?{" "}
            <button className="text-neutral-200 hover:text-white underline decoration-neutral-600 hover:decoration-neutral-400 transition">
              Reschedule
            </button>
            {" "}or{" "}
            <button className="text-neutral-200 hover:text-white underline decoration-neutral-600 hover:decoration-neutral-400 transition">
              Cancel
            </button>
          </div>

          <button
            onClick={() => router.push("/bookings")}
            className="w-full sm:w-auto rounded-lg px-5 py-2.5 bg-white text-black font-semibold hover:bg-neutral-100 transition shadow-lg shadow-white/10"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 sm:gap-5">
      <div className="flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
          {label}
        </div>
        <div className="text-sm sm:text-base text-neutral-200">
          {value}
        </div>
      </div>
    </div>
  );
}