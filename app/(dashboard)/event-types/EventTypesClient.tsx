"use client";

import { useState } from "react";
import { Clock, Edit, ExternalLink, Trash, Plus, Link2 } from "lucide-react";
import CreateEventTypeModal from "./CreateEventTypeModal";
import EditEventTypeModal from "./EditEventTypeModal";
import { deleteEventType } from "./actions";

type EventType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: number;
  buffer: number;
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-5 sm:py-6 border-b border-neutral-800/50 last:border-b-0 gap-4 hover:bg-neutral-800/20 transition group">
      <div className="flex-1 space-y-2">
        <div>
          <h3 className="font-semibold text-neutral-100 text-base sm:text-lg mb-1">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-1">
              {event.description}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              /vivek-hipparkar-xyz/{event.slug}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.duration} min</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <a
          href={`/username/${event.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-neutral-700/50 bg-neutral-800/30 px-3 py-2 text-neutral-200 hover:bg-neutral-700/50 hover:border-neutral-600 transition"
          title="View public page"
        >
          <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
        </a>
        <button
          onClick={onEdit}
          className="rounded-lg border border-neutral-700/50 bg-neutral-800/30 px-3 py-2 text-neutral-200 hover:bg-neutral-700/50 hover:border-neutral-600 transition"
          title="Edit event"
        >
          <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-red-400 hover:bg-red-900/40 hover:border-red-800 transition"
          title="Delete event"
        >
          <Trash size={16} className="sm:w-[18px] sm:h-[18px]" />
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
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100">
            Event Types
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Create events to share for people to book on your calendar.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold text-black hover:bg-neutral-100 transition shadow-lg shadow-white/10 w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>New</span>
        </button>
      </div>

      {/* Event list */}
      <div className="rounded-xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm overflow-hidden">
        {eventTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-neutral-500" />
            </div>
            <h3 className="text-sm sm:text-base font-medium text-neutral-300 mb-2">
              No event types yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mb-6">
              Create your first event type to start accepting bookings from people.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-100 transition"
            >
              <Plus size={16} />
              <span>Create Event Type</span>
            </button>
          </div>
        ) : (
          <div>
            {eventTypes.map((event) => (
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
            ))}
          </div>
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
    </div>
  );
}