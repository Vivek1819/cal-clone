"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import CreateEventTypeModal from "./CreateEventTypeModal";
import EditEventTypeModal from "./EditEventTypeModal";
import { deleteEventType } from "./actions";

type EventType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
};

function EventRow({
  event,
  onEdit,
  onDelete,
}: {
  event: EventType;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 last:border-b-0">
      <div className="space-y-1">
        <div className="font-medium text-neutral-100">{event.title}</div>
        <div className="text-sm text-neutral-400">
          /vivek-hipparkar-xyz/{event.slug}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
          <Clock size={14} />
          <span>{event.duration}m</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="rounded-md border border-red-900 bg-red-950 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/40"
        >
          Delete
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
  const [editOpen, setEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

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
              event={event}
              onEdit={() => {
                setEditingEvent(event);
                setEditOpen(true);
              }}
              onDelete={async () => {
                if (!confirm("Delete this event type?")) return;
                await deleteEventType(event.id);
                location.reload();
              }}
            />
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      <CreateEventTypeModal open={open} onClose={() => setOpen(false)} />

      {/* EDIT MODAL */}
      <EditEventTypeModal
        open={editOpen}
        event={editingEvent}
        onClose={() => {
          setEditOpen(false);
          setEditingEvent(null);
        }}
      />
    </>
  );
}
