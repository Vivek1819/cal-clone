import { getBookings } from "./actions";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const bookings = await getBookings(); // fetch ALL bookings

  return <BookingsClient bookings={bookings} />;
}
