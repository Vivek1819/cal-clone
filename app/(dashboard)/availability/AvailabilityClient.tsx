"use client";

import { useState } from "react";
import {
  saveAvailability,
  getDateOverrides,
  saveDateOverrides,
  deleteDateOverride,
} from "./actions";
import {
  Globe,
  Check,
  Edit,
  Edit2,
  Edit3,
  Edit2Icon,
  Delete,
  DeleteIcon,
  RemoveFormatting,
  Trash,
  Trash2,
} from "lucide-react";
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
  const [editingOverride, setEditingOverride] = useState<DateOverride | null>(
    null
  );

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
                      enabled ? "bg-white" : "bg-neutral-700"
                    }`}
                    aria-label={`Toggle ${day.label}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-black transition-transform shadow-sm ${
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

      {/* DATE OVERRIDES - IMPROVED UI */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-100">
              Date Overrides
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Override your regular availability for specific dates
            </p>
          </div>

          <button
            onClick={() => {
              setEditingOverride(null);
              setOverrideModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700/50 hover:border-neutral-600 transition w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Override</span>
          </button>
        </div>

        <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm overflow-hidden">
          {overrides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-300 mb-2">
                No date overrides
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mb-6">
                Add specific dates when your availability differs from your
                regular schedule
              </p>
              <button
                onClick={() => {
                  setEditingOverride(null);
                  setOverrideModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-100 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add Your First Override</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/50">
              {overrides.map((o) => {
                const dateObj = new Date(o.date + "T00:00:00");
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={o.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 hover:bg-neutral-800/20 transition group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          o.enabled
                            ? "bg-white/10 border border-white/20"
                            : "bg-white/10 border border-white/20"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            o.enabled ? "text-white" : "text-white"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {o.enabled ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          )}
                        </svg>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-neutral-100">
                          {formattedDate}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                          {o.enabled ? (
                            <>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                {o.startTime} – {o.endTime}
                              </span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                />
                              </svg>
                              <span>Unavailable all day</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-14 sm:ml-0">
                      <button
                        onClick={() => {
                          setEditingOverride(o);
                          setOverrideModalOpen(true);
                        }}
                        className="cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-800/30 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700/50 hover:border-neutral-600 transition"
                      >
                        <Edit2Icon size={16} />
                      </button>

                      <button
                        onClick={async () => {
                          if (!confirm("Remove this date override?")) return;
                          await deleteDateOverride(o.date);
                          setOverrides((prev) =>
                            prev.filter((x) => x.date !== o.date)
                          );
                        }}
                        className="cursor-pointer rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/40 hover:border-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DateOverrideModal
        open={overrideModalOpen}
        editingOverride={editingOverride}
        overriddenDates={overrides.map((o) => o.date)}
        onClose={() => setOverrideModalOpen(false)}
        onSave={handleSaveOverride}
      />
    </div>
  );
}
