import { prisma } from "@/lib/prisma";
import AvailabilityClient from "./AvailabilityClient";

export default async function AvailabilityPage() {
  const userId = "demo-user"; 

  const availability = await prisma.availability.findUnique({
    where: { userId },
  });

  return <AvailabilityClient availability={availability} userId={userId} />;
}
