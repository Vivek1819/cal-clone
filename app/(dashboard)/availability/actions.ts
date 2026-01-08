"use server";

import { prisma } from "@/lib/prisma";

export async function getAvailability(userId: string) {
  return prisma.availability.findFirst({
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
  const existing = await prisma.availability.findFirst({
    where: { userId: data.userId },
  });

  if (existing) {
    await prisma.availability.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.availability.create({
      data,
    });
  }
}

export async function saveDateOverrides(
  userId: string,
  overrides: {
    date: string;
    enabled: boolean;
    startTime: string | null;
    endTime: string | null;
    reason?: string | null;
  }[]
) {
  await prisma.dateOverride.deleteMany({
    where: {
      date: { in: overrides.map((o) => o.date) },
    },
  });

  await prisma.dateOverride.createMany({
    data: overrides.map((o) => ({
      date: o.date,
      enabled: o.enabled,
      startTime: o.startTime,
      endTime: o.endTime,
      reason: o.reason ?? null,
    })),
  });
}

export async function getDateOverrides() {
  return prisma.dateOverride.findMany({
    orderBy: { date: "asc" },
  });
}

export async function deleteDateOverride(date: string) {
  await prisma.dateOverride.delete({
    where: { date },
  });
}
