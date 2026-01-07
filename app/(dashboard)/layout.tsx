"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Clock, Layers, Link2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 px-3 py-4">
        {/* Brand */}
        <div className="px-4 mb-8">
          <p className="text-base tracking-tight">
            Cal.com
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <SidebarItem
            href="/event-types"
            icon={<Link2 size={22} />}
            label="Event Types"
            active={pathname === "/event-types"}
          />

          <SidebarItem
            href="/bookings"
            icon={<Calendar size={22} />}
            label="Bookings"
            active={pathname === "/bookings"}
          />

          <SidebarItem
            href="/availability"
            icon={<Clock size={22} />}
            label="Availability"
            active={pathname === "/availability"}
          />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-12 py-10">
          {children}
      </main>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[16px] font-medium transition-all mx-1 ${
        active
          ? `
            bg-neutral-600
            text-neutral-100
            shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          `
          : `
            text-neutral-400
            hover:bg-neutral-800/40
            hover:text-neutral-100
          `
      }`}
    >
      <div
        className={`flex items-center justify-center w-5 h-5 ${
          active
            ? "text-neutral-100"
            : "text-neutral-400 group-hover:text-neutral-100"
        }`}
      >
        {icon}
      </div>
      <span className="leading-none">{label}</span>
    </Link>
  );
}
