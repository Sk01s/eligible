import BannedForm from "@/components/BannedForm";
import { fetchAllBannedData } from "@/lib/utils";
export const dynamic = "force-dynamic"; // Ensures it's always rendered server-side
export default async function Page() {
  const initialData = await fetchAllBannedData();
  return <BannedForm initialData={initialData} />;
}
