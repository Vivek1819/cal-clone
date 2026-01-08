"use server";

import { prisma } from "@/lib/prisma";

export async function createEventType(data: {
  title: string;
  slug: string;
  description: string;
  duration: number;
  buffer: number;
}) {
  await prisma.eventType.create({
    data,
  });
}

export async function updateEventType(data: {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  buffer: number;
}) {
  await prisma.eventType.update({
    where: { id: data.id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      duration: data.duration,
      buffer: data.buffer,
    },
  });
}


export async function deleteEventType(id: string) {
  await prisma.eventType.delete({
    where: { id },
  });
}
