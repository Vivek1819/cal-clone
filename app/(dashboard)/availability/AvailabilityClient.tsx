"use client";

import { useState } from "react";
import {
  saveAvailability,
  getDateOverrides,
  saveDateOverrides,
  deleteDateOverride
} from "./actions";
import { Globe, Check } from "lucide-react";
import DateOverrideModal from "./DateOverrideModal";

type Availability = {
  userId: string;
  timezone: string;

  sundayEnabled: boolean;
  sundayStart: string | null;
  sundayEnd: string | null;

  mondayEnabled: boolean;
  mondayStart: string | null;
  mondayEnd: string | null;

  tuesdayEnabled: boolean;
  tuesdayStart: string | null;
  tuesdayEnd: string | null;

  wednesdayEnabled: boolean;
  wednesdayStart: string | null;
  wednesdayEnd: string | null;

  thursdayEnabled: boolean;
  thursdayStart: string | null;
  thursdayEnd: string | null;

  fridayEnabled: boolean;
  fridayStart: string | null;
  fridayEnd: string | null;

  saturdayEnabled: boolean;
  saturdayStart: string | null;
  saturdayEnd: string | null;
};

type DateOverride = {
  id: string;
  date: string;
  enabled: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

const DAYS = [
  { key: "sunday", label: "Sunday", short: "Sun" },
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
] as const;

type Props = {
  userId: string;
  availability: Availability | null;
  initialOverrides: DateOverride[];
};

type SaveAvailabilityInput = Availability;

function getDefaultAvailability(userId: string): Availability {
  return {
    userId,
    timezone: "Asia/Kolkata",

    sundayEnabled: false,
    sundayStart: null,
    sundayEnd: null,

    mondayEnabled: true,
    mondayStart: "09:00",
    mondayEnd: "17:00",

    tuesdayEnabled: true,
    tuesdayStart: "09:00",
    tuesdayEnd: "17:00",

    wednesdayEnabled: true,
    wednesdayStart: "09:00",
    wednesdayEnd: "17:00",

    thursdayEnabled: true,
    thursdayStart: "09:00",
    thursdayEnd: "17:00",

    fridayEnabled: true,
    fridayStart: "09:00",
    fridayEnd: "17:00",

    saturdayEnabled: false,
    saturdayStart: null,
    saturdayEnd: null,
  };
}

export default function AvailabilityClient({
  userId,
  availability,
  initialOverrides,
}: Props) {
  const [state, setState] = useState<SaveAvailabilityInput>(
    availability ?? getDefaultAvailability(userId)
  );
  const [saving, setSaving] = useState(false);
  const [overrides, setOverrides] = useState<DateOverride[]>(initialOverrides);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  function toggleDay(day: string) {
    setState((prev) => ({
      ...prev,
      [`${day}Enabled`]: !prev[`${day}Enabled` as keyof Availability],
    }));
  }

  function updateTime(day: string, field: "Start" | "End", value: string) {
    setState((prev) => ({
      ...prev,
      [`${day}${field}`]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    await saveAvailability(state);
    setSaving(false);
  }

  async function handleSaveOverride(payload: {
    dates: string[];
    enabled: boolean;
    startTime: string | null;
    endTime: string | null;
  }) {
    const newOverrides = payload.dates.map((date) => ({
      date,
      enabled: payload.enabled,
      startTime: payload.startTime,
      endTime: payload.endTime,
    }));

    await saveDateOverrides(userId, newOverrides);

    const refreshed = await getDateOverrides();
    setOverrides(refreshed);
    setOverrideModalOpen(false);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100">
            Availability
          </h1>
          <p className="mt-2 text-sm sm:text-sm text-neutral-400">
            Set your weekly hours when you're available for meetings.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold text-black hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-white/10 w-full sm:w-auto"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* Timezone */}
      <div className="mb-6 sm:mb-8 bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-neutral-400" />
          <label className="text-sm font-medium text-neutral-300">
            Timezone
          </label>
        </div>
        <select
          value={state.timezone}
          onChange={(e) =>
            setState((prev) => ({ ...prev, timezone: e.target.value }))
          }
          className="w-full sm:max-w-sm rounded-lg border border-neutral-700/50 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
        >
          <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
          <option value="UTC">UTC (GMT+0:00)</option>
          <option value="America/New_York">America/New York (GMT-5:00)</option>
          <option value="Europe/London">Europe/London (GMT+0:00)</option>
        </select>
      </div>

      {/* Days */}
      <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm overflow-hidden">
        {DAYS.map((day) => {
          const enabled = state[
            `${day.key}Enabled` as keyof Availability
          ] as boolean;
          const start = state[`${day.key}Start` as keyof Availability] as
            | string
            | null;
          const end = state[`${day.key}End` as keyof Availability] as
            | string
            | null;

          return (
            <div
              key={day.key}
              className="border-b border-neutral-800/50 last:border-b-0 hover:bg-neutral-800/20 transition"
            >
              {/* Day row - always horizontal */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-5">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleDay(day.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      enabled ? "bg-emerald-500" : "bg-neutral-700"
                    }`}
                    aria-label={`Toggle ${day.label}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                        enabled ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  <div>
                    <div className="text-sm sm:text-base font-medium text-neutral-100">
                      {day.label}
                    </div>
                    {!enabled && (
                      <div className="text-xs text-neutral-500 mt-0.5">
                        Unavailable
                      </div>
                    )}
                  </div>
                </div>

                {/* Time inputs - visible on larger screens */}
                {enabled ? (
                  <div className="hidden md:flex items-center gap-3">
                    <input
                      type="time"
                      value={start ?? "09:00"}
                      onChange={(e) =>
                        updateTime(day.key, "Start", e.target.value)
                      }
                      className="rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                    />
                    <span className="text-sm text-neutral-500">–</span>
                    <input
                      type="time"
                      value={end ?? "17:00"}
                      onChange={(e) =>
                        updateTime(day.key, "End", e.target.value)
                      }
                      className="rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                    />
                  </div>
                ) : (
                  <div className="h-6 hidden md:block" />
                )}
              </div>

              {/* Time inputs - stacked below on mobile/tablet */}
              {enabled && (
                <div className="flex md:hidden items-center gap-2 px-4 sm:px-6 pb-5">
                  <input
                    type="time"
                    value={start ?? "09:00"}
                    onChange={(e) =>
                      updateTime(day.key, "Start", e.target.value)
                    }
                    className="flex-1 rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  />
                  <span className="text-sm text-neutral-500">–</span>
                  <input
                    type="time"
                    value={end ?? "17:00"}
                    onChange={(e) => updateTime(day.key, "End", e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DATE OVERRIDES */}
      <div className="mt-10 rounded-xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-neutral-100">
              Date overrides
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Add dates when your availability changes from your daily hours.
            </p>
          </div>

          <button
            onClick={() => setOverrideModalOpen(true)}
            className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition"
          >
            + Add an override
          </button>
        </div>

        {overrides.length === 0 ? (
          <div className="text-sm text-neutral-500">No date overrides yet.</div>
        ) : (
          <div className="space-y-2">
            {overrides.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-neutral-100">{o.date}</div>
                  <div className="text-xs text-neutral-400">
                    {o.enabled
                      ? `${o.startTime} – ${o.endTime}`
                      : "Unavailable all day"}
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await deleteDateOverride(o.date);
                    setOverrides((prev) =>
                      prev.filter((x) => x.date !== o.date)
                    );
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <DateOverrideModal
        open={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        onSave={handleSaveOverride}
      />
    </div>
  );
}
