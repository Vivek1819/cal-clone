"use client";

import { useState } from "react";
import { createEventType } from "./actions";
import { useRouter } from "next/navigation";

type CreateEventTypeModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateEventTypeModal({
  open,
  onClose,
}: CreateEventTypeModalProps) {
  if (!open) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [duration, setDuration] = useState(15);
  const [buffer, setBuffer] = useState(0);
  const [slugEdited, setSlugEdited] = useState(false);

  const router = useRouter();

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function handleCreate() {
    if (!title || !slug) return;

    await createEventType({
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
          {/* Header */}
          <div className="mb-3 sm:mb-5">
            <h2 className="text-sm sm:text-lg font-semibold text-neutral-100">
              Add a new event type
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Set up event types to offer different types of meetings.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-2.5 sm:space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs text-neutral-300">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="Quick Chat"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);

                  if (!slugEdited) {
                    setSlug(generateSlug(value));
                  }
                }}
              />
            </div>

            {/* URL */}
            <div>
              <label className="text-xs text-neutral-300">URL Slug</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="quick-chat"
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(generateSlug(e.target.value));
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-neutral-300">Description</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="A quick video meeting."
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
                Time blocked before and after each meeting
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 rounded-b-xl border-t border-neutral-800 bg-neutral-900/60 px-3 sm:px-6 py-2.5 sm:py-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-neutral-300 hover:text-neutral-100 rounded-md hover:bg-neutral-800 sm:hover:bg-transparent transition"
          >
            Close
          </button>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto rounded-md bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black hover:bg-neutral-200"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}