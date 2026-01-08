import AvailabilityClient from "./AvailabilityClient";
import { getAvailability, getDateOverrides } from "./actions";

export default async function AvailabilityPage() {
  const userId = "username"; 

  const availability = await getAvailability(userId);
  const overrides = await getDateOverrides();

  return (
    <AvailabilityClient
      userId={userId}
      availability={availability}
      initialOverrides={overrides}
    />
  );
}
