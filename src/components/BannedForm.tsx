"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddBannedForm from "./AddBannedForm";
import BannedCountryCard from "./BannedCountryCard";
import BannedContinentCard from "./BannedContinentCard";
import BannedNationalityCard from "./BannedNationalityCard";

import { fetchAllBannedData } from "@/lib/utils";
import { viewAllBannedContinents } from "@/app/actions/bannedContinentActions";
import { viewAllBannedCountries } from "@/app/actions/bannedCountryActions";
import { viewAllBannedNationalities } from "@/app/actions/bannedNationalityActions";
import {
  BannedCountryView,
  BannedContinentView,
  BannedNationalityView,
  AccountStationOption,
  Nationality,
  AccountType,
  Country,
  Continent,
} from "@/db/dbTypes";
import { Input } from "./ui/input";
type BannedFormProps = {
  initialData: {
    bannedCountries: BannedCountryView[];
    bannedContinents: BannedContinentView[];
    bannedNationality: BannedNationalityView[];
    nationalities: Nationality[];
    countries: Country[];
    continents: Continent[];
    accountTypes: AccountType[];
    accountStationOptions: AccountStationOption[];
  };
};

export default function BannedForm({ initialData }: BannedFormProps) {
  const [bannedCountries, setBannedCountries] = useState(
    initialData?.bannedCountries || []
  );
  const [bannedContinents, setBannedContinents] = useState(
    initialData?.bannedContinents || []
  );
  const [bannedNationality, setBannedNationality] = useState(
    initialData?.bannedNationality || []
  );
  const [countries, setCountries] = useState(initialData?.countries || []);
  const [nationalities, setNationalities] = useState(
    initialData?.nationalities || []
  );
  const [accountTypes, setAccountTypes] = useState(
    initialData?.accountTypes || []
  );
  const [continents, setContinents] = useState(initialData?.continents || []);
  const [accountStationOptions, setAccountStationOptions] = useState(
    initialData?.accountStationOptions || []
  );
  const [openDialog, setOpenDialog] = useState<
    "Country" | "Continent" | "Nationality" | null
  >(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState<string>("");
  const [nationalitySearchQuery, setNationalitySearchQuery] =
    useState<string>("");
  const [continentSearchQuery, setContinentSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    const updatedData = await fetchAllBannedData();
    setBannedCountries(updatedData.bannedCountries);
    setBannedContinents(updatedData.bannedContinents);
    setBannedNationality(updatedData.bannedNationality);
    setCountries(updatedData.countries);
    setNationalities(updatedData.nationalities);
    setAccountTypes(updatedData.accountTypes);
    setContinents(updatedData.continents);
    setAccountStationOptions(updatedData.accountStationOptions);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialData) fetchAllData();
  }, [initialData]);

  const handleUpdate = async (
    type:
      | "Country"
      | "Continent"
      | "Nationality"
      | "Banned Countries"
      | "Banned Continents"
      | "Banned Nationality"
      | "Account Station Options"
  ) => {
    switch (type) {
      case "Banned Countries":
        const BannedCountries = await viewAllBannedCountries();
        setBannedCountries(BannedCountries);
        break;
      case "Banned Continents":
        const BannedContinents = await viewAllBannedContinents();
        setBannedContinents(BannedContinents);
        break;
      case "Banned Nationality":
        const BannedNationality = await viewAllBannedNationalities();
        setBannedNationality(BannedNationality);
        break;

      default:
        break;
    }
  };

  const handleOpenDialog = (type: "Country" | "Continent" | "Nationality") =>
    setOpenDialog(type);
  const handleCloseDialog = () => setOpenDialog(null);

  const filteredBannedCountries = bannedCountries.filter((country) =>
    country.CountryName.toLowerCase().startsWith(
      countrySearchQuery.toLowerCase()
    )
  );

  const filteredBannedNationalities = bannedNationality.filter((nationality) =>
    nationality.NationalityName.toLowerCase().startsWith(
      nationalitySearchQuery.toLowerCase()
    )
  );

  const filteredBannedContinents = bannedContinents.filter((continent) =>
    continent.ContinentName.toLowerCase().startsWith(
      continentSearchQuery.toLowerCase()
    )
  );

  const renderSkeletonCards = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} className="h-20 w-full mb-3 rounded-lg" />
    ));
  };

  return (
    <main className="max-w-[1200px] mx-auto">
      {/* Banned Countries */}
      <article className="p-10 mt-10 bg-zinc-50 border rounded-xl">
        <h2 className="font-bold text-xl text-center mb-8">Banned Countries</h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedCountries.length || "None"}</span>
          <div className="flex justify-center items-center gap-3">
            <Input
              type="text"
              className="py-[.4rem] px-3 border-2 border-gray-600 rounded-md focus-within:shadow-md"
              placeholder="Search countries..."
              value={countrySearchQuery}
              onChange={(e) => setCountrySearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-800 block"
              onClick={() => handleOpenDialog("Country")}
            >
              Add Country
            </Button>
          </div>
        </div>
        <div className="mt-5 max-h-[25rem] overflow-y-scroll flex flex-col gap-1">
          {loading
            ? renderSkeletonCards(5)
            : filteredBannedCountries.map((bannedCountry) => (
                <BannedCountryCard
                  accountStationOptions={accountStationOptions}
                  accountTypes={accountTypes}
                  countries={countries}
                  data={bannedCountry}
                  key={bannedCountry.BannedCountryID}
                  onDelete={() => handleUpdate("Banned Countries")}
                />
              ))}
        </div>
      </article>

      {/* Banned Nationalities */}
      <article className="p-10 mt-10 bg-zinc-50 border rounded-xl">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Nationalities
        </h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedNationalities.length || "None"}</span>
          <div className="flex justify-center items-center gap-3">
            <Input
              type="text"
              className="py-[.4rem] px-3 border-2 border-gray-600 rounded-md focus-within:shadow-md"
              placeholder="Search nationalities..."
              value={nationalitySearchQuery}
              onChange={(e) => setNationalitySearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-800 block"
              onClick={() => handleOpenDialog("Nationality")}
            >
              Add Nationality
            </Button>
          </div>
        </div>
        <div className="mt-5 max-h-[25rem] overflow-y-scroll flex flex-col gap-1">
          {loading
            ? renderSkeletonCards(5)
            : filteredBannedNationalities.map((bannedNationalit) => (
                <BannedNationalityCard
                  accountStationOptions={accountStationOptions}
                  accountTypes={accountTypes}
                  nationalities={nationalities}
                  data={bannedNationalit}
                  key={bannedNationalit.BannedNationalityID}
                  onDelete={() => handleUpdate("Banned Nationality")}
                />
              ))}
        </div>
      </article>

      {/* Banned Continents */}
      <article className="p-10 mt-10 bg-zinc-50 border rounded-xl">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Continents
        </h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedContinents.length || "None"}</span>
          <div className="flex justify-center items-center gap-3 ">
            <Input
              type="text"
              className="py-[.4rem] px-3 border-2 border-gray-600 rounded-md focus-within:shadow-md"
              placeholder="Search continents..."
              value={continentSearchQuery}
              onChange={(e) => setContinentSearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-800 block"
              onClick={() => handleOpenDialog("Continent")}
            >
              Add Continent
            </Button>
          </div>
        </div>
        <div className="mt-5 max-h-[25rem] overflow-y-scroll flex flex-col gap-1">
          {loading
            ? renderSkeletonCards(5)
            : filteredBannedContinents.map((bannedContinent) => (
                <BannedContinentCard
                  accountStationOptions={accountStationOptions}
                  accountTypes={accountTypes}
                  continents={continents}
                  data={bannedContinent}
                  key={bannedContinent.BannedContinentID}
                  onDelete={() => handleUpdate("Banned Continents")}
                />
              ))}
        </div>
      </article>

      {/* Dialog for Banned Country */}

      <AddBannedForm
        accountTypes={accountTypes}
        countries={countries}
        nationalities={nationalities}
        continents={continents}
        accountStationOptions={accountStationOptions}
        bannedName="Country"
        handleCloseDialog={handleCloseDialog}
        openDialog={openDialog ?? ""}
        onAdd={() => handleUpdate("Banned Countries")}
      />
      {/* Dialog for Banned Continent */}

      <AddBannedForm
        accountTypes={accountTypes}
        countries={countries}
        nationalities={nationalities}
        continents={continents}
        accountStationOptions={accountStationOptions}
        bannedName="Continent"
        handleCloseDialog={handleCloseDialog}
        openDialog={openDialog ?? ""}
        onAdd={() => handleUpdate("Banned Continents")}
      />

      {/* Dialog for Banned Nationality */}
      <AddBannedForm
        accountTypes={accountTypes}
        countries={countries}
        nationalities={nationalities}
        continents={continents}
        accountStationOptions={accountStationOptions}
        bannedName="Nationality"
        handleCloseDialog={handleCloseDialog}
        openDialog={openDialog ?? ""}
        onAdd={() => handleUpdate("Banned Nationality")}
      />
    </main>
  );
}
