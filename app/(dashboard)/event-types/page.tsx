import { prisma } from "@/lib/prisma";
import EventTypesClient from "./EventTypesClient";

export default async function EventTypesPage() {
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      duration: true,
      buffer: true, 
    },
  });

  return <EventTypesClient eventTypes={eventTypes} />;
}
