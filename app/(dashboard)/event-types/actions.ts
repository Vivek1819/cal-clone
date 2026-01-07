"use server";

import { prisma } from "@/lib/prisma";

export async function createEventType({
  title,
  slug,
  description,
  duration,
}: {
  title: string;
  slug: string;
  description?: string;
  duration: number;
}) {
  // basic safety (Cal.com also validates later, this is fine for now)
  if (!title || !slug || !duration) {
    throw new Error("Missing required fields");
  }

  const eventType = await prisma.eventType.create({
    data: {
      title,
      slug,
      description,
      duration,
    },
  });

  return eventType;
}
