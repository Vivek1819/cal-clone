"use client";

type CreateEventTypeModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateEventTypeModal({
  open,
  onClose,
}: CreateEventTypeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-950 shadow-xl">
        {/* Body */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-100">
              Add a new event type
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Set up event types to offer different types of meetings.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm text-neutral-300">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                placeholder="Quick Chat"
              />
            </div>

            {/* URL */}
            <div>
              <label className="text-sm text-neutral-300">URL</label>
              <input
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                placeholder="yourname/quick-chat"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-neutral-300">Description</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                placeholder="A quick video meeting."
              />
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm text-neutral-300">Duration</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 pr-16 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                  minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 rounded-b-xl border-t border-neutral-800 bg-neutral-900/60 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm text-neutral-300 hover:text-neutral-100"
          >
            Close
          </button>
          <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
