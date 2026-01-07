// app/[username]/[eventSlug]/page.tsx

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BookingCalendar from "./BookingCalendar";

type PageProps = {
  params: Promise<{
    username: string;
    eventSlug: string;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { username, eventSlug } = await params;

  const eventType = await prisma.eventType.findFirst({
    where: { slug: eventSlug },
  });

  if (!eventType) {
    notFound();
  }

  const availability = await prisma.availability.findFirst();

  if (!availability) {
    notFound();
  }

  return (
    <BookingCalendar
      eventType={eventType}
      availability={availability}
      username={username}
    />
  );
}
