import { prisma } from "@/lib/prisma";
import BookingCalendar from "../BookingCalendar";

type PageProps = {
  params: {
    username: string;
    eventSlug: string;
  };
};

export default async function BookingPage({ params }: PageProps) {
  const { username, eventSlug } = params;

  const eventType = await prisma.eventType.findFirst({
    where: { slug: eventSlug },
  });

  if (!eventType) {
    return null;
  }

  const availability = await prisma.availability.findFirst();

  if (!availability) {
    return null;
  }

  return (
    <BookingCalendar
      username={username}
      eventType={eventType}
      availability={availability}
    />
  );
}
