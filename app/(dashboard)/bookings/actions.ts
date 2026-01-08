"use server";

import { prisma } from "@/lib/prisma";

export async function getBookings() {
  return prisma.booking.findMany({
    orderBy: { date: "asc" },
    include: {
      eventType: true,
    },
  });
}

export async function cancelBooking(id: string) {
  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}
