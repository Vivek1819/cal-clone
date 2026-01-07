"use server";

import { prisma } from "@/lib/prisma";

export async function getAvailability(userId: string) {
  return prisma.availability.findUnique({
    where: { userId },
  });
}

export async function createDefaultAvailability(userId: string) {
  return prisma.availability.create({
    data: {
      userId,
      timezone: "Asia/Kolkata",

      sundayEnabled: false,

      mondayEnabled: true,
      mondayStart: "09:00",
      mondayEnd: "17:00",

      tuesdayEnabled: true,
      tuesdayStart: "09:00",
      tuesdayEnd: "17:00",

      wednesdayEnabled: true,
      wednesdayStart: "09:00",
      wednesdayEnd: "17:00",

      thursdayEnabled: true,
      thursdayStart: "09:00",
      thursdayEnd: "17:00",

      fridayEnabled: true,
      fridayStart: "09:00",
      fridayEnd: "17:00",

      saturdayEnabled: false,
    },
  });
}

export async function updateAvailability(
  userId: string,
  data: Omit<Parameters<typeof prisma.availability.update>[0]["data"], never>
) {
  await prisma.availability.update({
    where: { userId },
    data,
  });
}

type SaveAvailabilityInput = {
  userId: string;
  timezone: string;

  sundayEnabled: boolean;
  sundayStart: string | null;
  sundayEnd: string | null;

  mondayEnabled: boolean;
  mondayStart: string | null;
  mondayEnd: string | null;

  tuesdayEnabled: boolean;
  tuesdayStart: string | null;
  tuesdayEnd: string | null;

  wednesdayEnabled: boolean;
  wednesdayStart: string | null;
  wednesdayEnd: string | null;

  thursdayEnabled: boolean;
  thursdayStart: string | null;
  thursdayEnd: string | null;

  fridayEnabled: boolean;
  fridayStart: string | null;
  fridayEnd: string | null;

  saturdayEnabled: boolean;
  saturdayStart: string | null;
  saturdayEnd: string | null;
};


export async function saveAvailability(data: SaveAvailabilityInput) {
  await prisma.availability.upsert({
    where: { userId: data.userId },
    update: data,
    create: data,
  });
}
