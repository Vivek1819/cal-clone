"use client";

import { useState, useEffect } from "react";
import { updateEventType } from "./actions";
import { useRouter } from "next/navigation";

type EditEventTypeModalProps = {
  open: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    duration: number;
    buffer: number;
  } | null;
};

export default function EditEventTypeModal({
  open,
  onClose,
  event,
}: EditEventTypeModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(15);
  const [buffer, setBuffer] = useState(event?.buffer ?? 0);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setSlug(event.slug);
      setDescription(event.description ?? "");
      setDuration(event.duration);
      setBuffer(event.buffer ?? 0);
    }
  }, [event]);

  if (!open || !event) return null;

  const currentEvent = event;

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function handleSave() {
    await updateEventType({
      id: currentEvent.id,
      title,
      slug,
      description,
      duration,
      buffer
    });

    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6">
      <div className="w-full max-w-[95vw] sm:max-w-lg rounded-lg sm:rounded-xl border border-neutral-800 bg-neutral-950 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Body */}
        <div className="p-3 sm:p-6">
          <h2 className="text-sm sm:text-lg font-semibold text-neutral-100">
            Edit event type
          </h2>

          <div className="mt-2.5 sm:mt-4 space-y-2.5 sm:space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs text-neutral-300">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  setSlug(generateSlug(value));
                }}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="text-xs text-neutral-300">URL Slug</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-neutral-300">Description</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs text-neutral-300">Duration</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 pr-14 sm:pr-20 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <span className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  minutes
                </span>
              </div>
            </div>

            {/* Buffer time */}
            <div>
              <label className="text-xs text-neutral-300">Buffer time</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 pr-14 sm:pr-20 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  value={buffer}
                  onChange={(e) => setBuffer(Number(e.target.value))}
                />
                <span className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                  minutes
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Extra time blocked before and after each meeting
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-neutral-800 bg-neutral-900/60 px-3 sm:px-6 py-2.5 sm:py-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-300 hover:text-neutral-100 rounded-md hover:bg-neutral-800 sm:hover:bg-transparent transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black hover:bg-neutral-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}