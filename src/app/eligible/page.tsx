import Form from "@/components/Form";

import InformationDisplay from "@/components/About";
import { fetchAllEligibleData } from "@/lib/utils";

export default async function EligiblePage() {
  const { accountTypes, nationalities, countries } =
    await fetchAllEligibleData();

  return (
    <main className="mt-10">
      <Form
        countries={countries}
        nationalities={nationalities}
        accountTypes={accountTypes}
      />
      <InformationDisplay />
    </main>
  );
}
