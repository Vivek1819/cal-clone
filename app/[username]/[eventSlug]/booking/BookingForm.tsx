"use client";

type Props = {
  eventTitle: string;
  dateLabel: string;
  timeLabel: string;
  duration: number;
  timezone: string;
  onBack: () => void;
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
  eventTitle,
  dateLabel,
  timeLabel,
  duration,
  timezone,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-neutral-100">
      <div className="flex w-full max-w-5xl min-h-[520px] rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {/* LEFT SUMMARY */}
        <div className="w-1/2 border-r border-neutral-800 p-12 space-y-6">
          <h2 className="text-2xl font-semibold">{eventTitle}</h2>

          <div className="text-base text-neutral-400">📅 {dateLabel}</div>

          <div className="text-base text-neutral-400">
            ⏰ {timeLabel} – {getEndTime(timeLabel, duration)}
          </div>

          <div className="text-base text-neutral-400">⏳ {duration} min</div>

          <div className="text-base text-neutral-400">🌍 {timezone}</div>
        </div>

        {/* FORM */}
        <div className="w-1/2 p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-neutral-300">
                Your name *
              </label>
              <input
                type="text"
                className="w-full h-11 rounded-md border border-neutral-800 bg-neutral-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-neutral-300">
                Email address *
              </label>
              <input
                type="email"
                className="w-full h-11 rounded-md border border-neutral-800 bg-neutral-900 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-neutral-300">
                Additional notes
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="Anything to prepare beforehand?"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between pt-8">
            <button
              onClick={onBack}
              className="
                    px-4 py-1.5
                    rounded-lg
                    text-sm font-medium
                    text-neutral-300
                    transition
                    hover:bg-neutral-800/70 backdrop-blur
                    hover:text-white
                "
            >
              Back
            </button>

            <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-neutral-200">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
