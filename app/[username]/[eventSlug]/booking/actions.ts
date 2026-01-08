"use server";

import { prisma } from "@/lib/prisma";

type CreateBookingInput = {
  name: string;
  email: string;
  notes?: string;
  date: Date;
  startTime: string;
  endTime: string;
  eventTypeId: string;
};

export async function createBooking(input: CreateBookingInput) {
  const {
    name,
    email,
    notes,
    date,
    startTime,
    endTime,
    eventTypeId,
  } = input;

  // 1️⃣ Basic validation
  if (!name || !email || !date || !startTime || !endTime || !eventTypeId) {
    throw new Error("Missing required booking fields");
  }

  // 2️⃣ Prevent double booking
  const existingBooking = await prisma.booking.findFirst({
    where: {
      eventTypeId,
      date,
      startTime,
      status: "BOOKED",
    },
  });

  if (existingBooking) {
    throw new Error("This time slot is already booked");
  }

  // 3️⃣ Create booking
  const booking = await prisma.booking.create({
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

  return booking;
}
