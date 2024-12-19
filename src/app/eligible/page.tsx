import Form from "@/components/Form";
import { getAllCountries } from "../actions/countryActions";
import { getAllNationalities } from "../actions/nationalityActions";
import { getAllAccountTypes } from "../actions/accountTypesActions";
import InformationDisplay from "@/components/About";

export default async function EligiblePage() {
  const countries = await getAllCountries();
  const nationalities = await getAllNationalities();
  const accountTypes = await getAllAccountTypes();

  return (
    <>
      <Form
        countries={countries}
        nationalities={nationalities}
        accountTypes={accountTypes}
      />
      <InformationDisplay />
    </>
  );
}
