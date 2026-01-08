import { getBookings } from "./actions";
import BookingsClient from "./BookingsClient";

type Props = {
  searchParams: Promise<{
    tab?: "upcoming" | "past" | "cancelled";
  }>;
};

export default async function BookingsPage({ searchParams }: Props) {
  const { tab = "upcoming" } = await searchParams;

  const status =
    tab === "cancelled"
      ? "CANCELLED"
      : tab === "past"
      ? "PAST"
      : "BOOKED";

  const bookings = await getBookings(status);

  return <BookingsClient bookings={bookings} activeTab={tab} />;
}
