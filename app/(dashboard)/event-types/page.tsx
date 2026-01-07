import { Search, ExternalLink, Link2, MoreHorizontal } from "lucide-react";

export default function EventTypesPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Event Types
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Create events to share for people to book on your calendar.
          </p>
        </div>

        <button className="rounded-md bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium">
          + New
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          placeholder="Search"
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-sm placeholder-neutral-500"
        />
      </div>

      {/* Event Types List */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 divide-y divide-neutral-800">
        <EventRow
          title="Secret Meeting"
          slug="/vivek-hipparkar-xyz/secret"
          duration="15m"
        />
        <EventRow
          title="30 Min Meeting"
          slug="/vivek-hipparkar-xyz/30min"
          duration="30m"
        />
        <EventRow
          title="15 Min Meeting"
          slug="/vivek-hipparkar-xyz/15min"
          duration="15m"
        />
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function EventRow({
  title,
  slug,
  duration
}: {
  title: string;
  slug: string;
  duration: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      {/* Left */}
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-neutral-400">
          {slug}
        </div>

        <span className="inline-flex items-center gap-1 mt-2 rounded bg-neutral-800 px-2 py-0.5 text-sm text-neutral-300">
          ⏱ {duration}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Action buttons */}
        <IconButton>
          <ExternalLink size={16} />
        </IconButton>
        <IconButton>
          <Link2 size={16} />
        </IconButton>
        <IconButton>
          <MoreHorizontal size={16} />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="
        h-9 w-9
        rounded-md
        border border-neutral-800
        bg-neutral-900
        flex items-center justify-center
        text-neutral-300
        hover:bg-neutral-800
        hover:text-neutral-100
        transition
      "
    >
      {children}
    </button>
  );
}
