"use server";

import { prisma } from "@/lib/prisma";

type CreateBookingInput = {
  name: string;
  email: string;
  date: string;        // YYYY-MM-DD
  startTime: string;
  endTime: string;
  eventTypeId: string;
};

export async function createBooking(input: CreateBookingInput) {
  const { name, email, date, startTime, endTime, eventTypeId } = input;

  if (!name || !email || !date || !startTime || !endTime || !eventTypeId) {
    throw new Error("Missing required booking fields");
  }

  // ❗ TEMP: still scoped to eventType (we'll globalize next)
  const existingBooking = await prisma.booking.findFirst({
    where: {
      date,            // STRING
      startTime,
      status: "BOOKED",
    },
  });

  if (existingBooking) {
    throw new Error("This time slot is already booked");
  }

  return prisma.booking.create({
    data: {
      name,
      email,
      date,            // STRING
      startTime,
      endTime,
      status: "BOOKED",
      eventTypeId,
    },
  });
}

export async function getBookedSlotsForDate(input: {
  date: string; // "YYYY-MM-DD"
}) {
  const { date } = input;

  const bookings = await prisma.booking.findMany({
    where: {
      date,
      status: "BOOKED", // important
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  return bookings;
}

