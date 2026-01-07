"use client";

import { useState } from "react";
import { Clock, Link as LinkIcon, ExternalLink, MoreHorizontal } from "lucide-react";
import CreateEventTypeModal from "./CreateEventTypeModal";

type EventType = {
  id: string;
  title: string;
  slug: string;
  duration: number;
};

function EventRow({
  title,
  slug,
  duration,
}: {
  title: string;
  slug: string;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 last:border-b-0">
      <div className="space-y-1">
        <div className="font-medium text-neutral-100">{title}</div>
        <div className="text-sm text-neutral-400">{slug}</div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md border border-neutral-800 hover:bg-neutral-800 transition">
          <ExternalLink size={18} />
        </button>
        <button className="p-2 rounded-md border border-neutral-800 hover:bg-neutral-800 transition">
          <LinkIcon size={18} />
        </button>
        <button className="p-2 rounded-md border border-neutral-800 hover:bg-neutral-800 transition">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

export default function EventTypesClient({
  eventTypes,
}: {
  eventTypes: EventType[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100">
            Event Types
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Create events to share for people to book on your calendar.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition"
        >
          + New
        </button>
      </div>

      {/* Event list */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
        {eventTypes.length === 0 ? (
          <div className="px-6 py-8 text-sm text-neutral-400">
            No event types yet.
          </div>
        ) : (
          eventTypes.map((event) => (
            <EventRow
              key={event.id}
              title={event.title}
              slug={`/vivek-hipparkar-xyz/${event.slug}`}
              duration={`${event.duration}m`}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateEventTypeModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
