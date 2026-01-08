"use client";

import { useState } from "react";
import { Calendar, Clock, Globe, Timer } from "lucide-react";

type Props = {
  username: string;
  eventTitle: string;
  dateLabel: string;
  timeLabel: string;
  duration: number;
  timezone: string;
  onBack: () => void;
  onConfirm: (data: {
    name: string;
    email: string;
    notes?: string;
  }) => Promise<void>;
};

function getEndTime(startTime: string, duration: number, use24h = false) {
  const date = new Date(`1970-01-01 ${startTime}`);
  date.setMinutes(date.getMinutes() + duration);

  return formatTime(date, use24h);
}

function formatTime(date: Date, use24h = false) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24h,
  });
}

export default function BookingForm({
  username,
  eventTitle,
  dateLabel,
  timeLabel,
  duration,
  timezone,
  onBack,
  onConfirm
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-950 to-black text-neutral-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl lg:min-h-[560px] rounded-xl border border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* LEFT SUMMARY */}
        <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-neutral-800/50 p-6 sm:p-8 lg:p-10 space-y-6 bg-neutral-900/30">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Event</div>
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100">{eventTitle}</h2>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-800/50">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500 mb-0.5">Date</div>
                <div className="text-sm sm:text-base text-neutral-200">{dateLabel}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500 mb-0.5">Time</div>
                <div className="text-sm sm:text-base text-neutral-200">
                  {timeLabel} – {getEndTime(timeLabel, duration)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500 mb-0.5">Duration</div>
                <div className="text-sm sm:text-base text-neutral-200">{duration} minutes</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-neutral-500 mb-0.5">Timezone</div>
                <div className="text-sm sm:text-base text-neutral-200">{timezone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-6">Enter Details</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Your name *
                </label>
                <input
                  type="text"
                  className="w-full h-11 rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Email address *
                </label>
                <input
                  type="email"
                  className="w-full h-11 rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Additional notes
                  <span className="text-neutral-500 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition resize-none"
                  placeholder="Please share anything that will help prepare for our meeting."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-8 mt-6 border-t border-neutral-800/50">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-400 transition hover:text-neutral-200 hover:bg-neutral-800/50"
            >
              Back
            </button>

            <button
              disabled={loading}
              onClick={async () => {
                setError(null);

                if (!name || !email) {
                  setError("Name and email are required");
                  return;
                }

                setLoading(true);
                try {
                  await onConfirm({ name, email, notes });
                } catch (err: any) {
                  setError(err.message ?? "Something went wrong");
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full sm:w-auto rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-white/10"
            >
              {loading ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}