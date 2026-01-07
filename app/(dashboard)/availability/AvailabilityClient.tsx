"use client";

import { useState } from "react";
import { saveAvailability } from "./actions";

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

const DAYS = [
  { key: "sunday", label: "Sunday" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
] as const;

type Props = {
  userId: string;
  availability: Availability | null;
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

export default function AvailabilityClient({ userId, availability }: Props) {
  const [state, setState] = useState<SaveAvailabilityInput>(
    availability ?? getDefaultAvailability(userId)
  );
  const [saving, setSaving] = useState(false);

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-100">
            Availability
          </h1>
          <p className="mt-2 text-base text-neutral-400">
            Set when you are available for meetings.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-white px-5 py-2.5 text-base font-medium text-black hover:bg-neutral-200 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Timezone */}
      <div className="mb-8">
        <label className="text-base text-neutral-300">Timezone </label>
        <select
          value={state.timezone}
          onChange={(e) =>
            setState((prev) => ({ ...prev, timezone: e.target.value }))
          }
          className="mt-2 w-full max-w-sm rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-base text-neutral-100"
        >
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Europe/London">Europe/London</option>
        </select>
      </div>

      {/* Days */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
        {DAYS.map((day) => {
          const enabled =
            state[`${day.key}Enabled` as keyof Availability] as boolean;
          const start =
            state[`${day.key}Start` as keyof Availability] as string | null;
          const end =
            state[`${day.key}End` as keyof Availability] as string | null;

          return (
            <div
              key={day.key}
              className="flex items-center justify-between border-b border-neutral-800 px-6 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-5">
                {/* Toggle */}
                <button
                  onClick={() => toggleDay(day.key)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                    enabled ? "bg-white" : "bg-neutral-700"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-black transition ${
                      enabled ? "translate-x-5.5" : "translate-x-0.75"
                    }`}
                  />
                </button>

                <span className="text-base text-neutral-200">
                  {day.label}
                </span>
              </div>

              {enabled ? (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={start ?? "09:00"}
                    onChange={(e) =>
                      updateTime(day.key, "Start", e.target.value)
                    }
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-base text-neutral-100"
                  />
                  <span className="text-base text-neutral-400">–</span>
                  <input
                    type="time"
                    value={end ?? "17:00"}
                    onChange={(e) =>
                      updateTime(day.key, "End", e.target.value)
                    }
                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-base text-neutral-100"
                  />
                </div>
              ) : (
                <div className="h-7" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
