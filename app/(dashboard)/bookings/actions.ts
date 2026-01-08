"use server";

import { prisma } from "@/lib/prisma";

export async function getBookings(status?: "BOOKED" | "CANCELLED" | "PAST") {
  const now = new Date();

  return prisma.booking.findMany({
    where:
      status === "CANCELLED"
        ? { status: "CANCELLED" }
        : status === "PAST"
        ? { date: { lt: now }, status: "BOOKED" }
        : { date: { gte: now }, status: "BOOKED" },

    include: {
      eventType: {
        select: {
          title: true,
          duration: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}



export async function cancelBooking(id: string) {
  await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}
