"use client";

import { CheckCircle, ExternalLink } from "lucide-react";

type Props = {
  eventTitle: string;
  hostName: string;
  guestName: string;
  guestEmail: string;
  dateLabel: string;
  timeRange: string;
  timezone: string;
  location?: string;
  onBackToBookings?: () => void;
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
  onBackToBookings,
}: Props) {
  return (
    <div className="min-h-screen bg-black text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center px-10 pt-10">
          <div className="h-12 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
            <CheckCircle className="text-emerald-400" size={32} />
          </div>

          <h1 className="text-2xl font-semibold mb-3">
            This meeting is scheduled
          </h1>

          <p className="text-md text-neutral-400 max-w-md">
            The meeting has been added to the calendar. You can find the details
            below.
          </p>
        </div>

        <div className="my-8 border-t border-neutral-800" />

        {/* Details */}
        <div className="px-14 space-y-10 text-md">

          <DetailRow
            label="What"
            value={`${eventTitle} between ${hostName} and ${guestName}`}
          />

          <DetailRow
            label="When"
            value={`${dateLabel}\n${timeRange} (${timezone})`}
          />

          <DetailRow
            label="Who"
            value={
              <>
                <div className="font-medium">{hostName} <span className="ml-2 text-xs bg-neutral-800 px-2 py-0.5 rounded">Host</span></div>
                <div className="text-neutral-400">{guestEmail}</div>

                <div className="mt-3 font-medium">{guestName}</div>
                <div className="text-neutral-400">{guestEmail}</div>
              </>
            }
          />

          <DetailRow
            label="Where"
            value={
              <div className="inline-flex items-center gap-1">
                {location}
                <ExternalLink size={14} className="text-neutral-400" />
              </div>
            }
          />
        </div>

        <div className="my-8 border-t border-neutral-800" />

        {/* Footer */}
        <div className="px-10 pb-8 text-sm flex items-center justify-center">
          <div className="text-neutral-400">
            Need to make a change?{" "}
            <button className="underline hover:text-white">Reschedule</button>{" "}
            or{" "}
            <button className="underline hover:text-white">Cancel</button>
          </div>

          {onBackToBookings && (
            <button
              onClick={onBackToBookings}
              className="rounded-md border border-neutral-800 px-4 py-2 hover:bg-neutral-800 transition"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-6 items-start">
      <div className="text-neutral-400">{label}</div>
      <div className="whitespace-pre-line">{value}</div>
    </div>
  );
}
