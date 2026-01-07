import { prisma } from "@/lib/prisma";
import EventTypesClient from "./EventTypesClient";

export default async function EventTypesPage() {
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <EventTypesClient eventTypes={eventTypes} />;
}
