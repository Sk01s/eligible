"use client";
import { useState, useEffect } from "react";
import { submitFormEligible } from "@/app/actions/formActions";
import { AccountType, Country, Nationality } from "@/db/dbTypes";
import SelectInput from "./SelectInput";

type FormParamters = {
  countries: Country[];
  nationalities: Nationality[];
  accountTypes: AccountType[];
};

export default function Form({
  countries,
  nationalities,
  accountTypes = [],
}: FormParamters) {
  const [errors, setErrors] = useState<
    Record<string, string[] | string | undefined>
  >({}); // State to hold errors

  const [results, setResults] = useState<
    {
      name: string;
      isContinentAccountBanned: boolean;
      isCountryAccountBanned: boolean;
      isNationalityAccountBanned: boolean;
    }[]
  >([]); // State to hold results

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement); // Get form data
    const response = await submitFormEligible(formData); // Call server action

    if (response.success) {
      console.log("Form submitted successfully:", response.data);
      setErrors({}); // Clear errors on success
      if (response.data) {
        setResults(
          response.data.map((item) => ({
            name: item.AccountStationOptionName,
            isContinentAccountBanned: item.isContinentAccountBanned,
            isCountryAccountBanned: item.isCountryAccountBanned,
            isNationalityAccountBanned: item.isNationalityAccountBanned,
          }))
        );
      }
    } else {
      console.error("Validation failed:", response.errors);
      setErrors(response.errors || {}); // Set validation errors
      setResults([]); // Clear results on error
    }
  };

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedNationality, setSelectedNationality] = useState<string | null>(
    null
  );
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(
    null
  );

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Effect to check form validity
  useEffect(() => {
    const isValid =
      selectedCountry && selectedNationality && selectedAccountType;
    setIsFormValid(!!isValid); // Ensure all fields are selected
  }, [selectedCountry, selectedNationality, selectedAccountType]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-md mx-auto p-6 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl font-bold">Eligible</h1>
        {/* Country */}
        <SelectInput
          array={countries}
          name="Country"
          setSelected={setSelectedCountry}
        />
        {/* Nationality */}
        <SelectInput
          array={nationalities}
          name="Nationality"
          setSelected={setSelectedNationality}
        />
        {/* Account Type */}
        <SelectInput
          array={accountTypes}
          name="AccountType"
          setSelected={setSelectedAccountType}
        />
        {/* Display errors */}
        {errors.country && <p className="text-red-500">{errors.country[0]}</p>}
        {errors.nationality && (
          <p className="text-red-500">{errors.nationality[0]}</p>
        )}
        {errors.accountType && (
          <p className="text-red-500">{errors.accountType[0]}</p>
        )}
        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-bold">Results:</h2>
            <ul>
              {results.map((result, index) => {
                const allFalse =
                  !result.isContinentAccountBanned &&
                  !result.isCountryAccountBanned &&
                  !result.isNationalityAccountBanned;

                if (allFalse) {
                  return (
                    <li key={index} className="text-green-600">
                      ✅ {result.name} isn&apos;t banned
                    </li>
                  );
                }

                return (
                  <li key={index} className="text-red-500">
                    ❌ {result.name}:{" "}
                    {result.isContinentAccountBanned && (
                      <div>Continent is banned</div>
                    )}
                    {result.isCountryAccountBanned && (
                      <div> Country is banned</div>
                    )}
                    {result.isNationalityAccountBanned && (
                      <div> Nationality is banned</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-4 py-2 px-4 rounded ${
            isFormValid
              ? "bg-slate-800 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
