"use server";

import { prisma } from "@/lib/prisma";

type CreateBookingInput = {
  name: string;
  email: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  eventTypeId: string;
};

export async function createBooking(input: CreateBookingInput) {
  const { name, email, date, startTime, endTime, eventTypeId } = input;

  if (!name || !email || !date || !startTime || !endTime || !eventTypeId) {
    throw new Error("Missing required booking fields");
  }

    // 1️⃣ Date override check (BLOCKED DAY)
  const override = await prisma.dateOverride.findUnique({
    where: { date },
  });

  if (override && override.enabled === false) {
    throw new Error("This date is unavailable for booking");
  }

  

  // Helper: convert "HH:MM AM/PM" → minutes since midnight
  function toMinutes(time: string) {
    const d = new Date(`1970-01-01 ${time}`);
    return d.getHours() * 60 + d.getMinutes();
  }

  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);

  const existingBookings = await prisma.booking.findMany({
    where: {
      date,
      status: "BOOKED",
    },
    select: {
      startTime: true,
      endTime: true,
      eventType: {
        select: {
          buffer: true,
        },
      },
    },
  });

  for (const booking of existingBookings) {
    const buffer = booking.eventType.buffer ?? 0;

    const bookingStart = toMinutes(booking.startTime) - buffer;

    const bookingEnd = toMinutes(booking.endTime) + buffer;

    const overlaps = newStart < bookingEnd && newEnd > bookingStart;

    if (overlaps) {
      throw new Error(
        "This time overlaps with another booking (including buffer time)"
      );
    }
  }

  return prisma.booking.create({
    data: {
      name,
      email,
      date,
      startTime,
      endTime,
      status: "BOOKED",
      eventTypeId,
    },
  });
}

export async function getBookedSlotsForDate(input: { date: string }) {
  return prisma.booking.findMany({
    where: {
      date: input.date,
      status: "BOOKED",
    },
    select: {
      startTime: true,
      endTime: true,
      eventType: {
        select: {
          duration: true,
          buffer: true,
        },
      },
    },
  });
}

export async function getDateAvailability(input: { date: string }) {
  const override = await prisma.dateOverride.findUnique({
    where: { date: input.date },
  });

  if (override && override.enabled === false) {
    return {
      blocked: true,
      startTime: null,
      endTime: null,
    };
  }

  if (override && override.enabled === true) {
    return {
      blocked: false,
      startTime: override.startTime,
      endTime: override.endTime,
    };
  }

  return {
    blocked: false,
    startTime: null,
    endTime: null,
  };
}
