"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchAllBannedData } from "@/lib/utils";
import {
  AccountStationOption,
  AccountType,
  BannedContinentView,
  BannedCountryView,
  BannedNationalityView,
  Continent,
  Country,
  Nationality,
} from "@/db/dbTypes";
import AddBannedForm from "./AddBannedForm";
import BannedCountryCard from "./BannedCountryCard";
import BannedContinentCard from "./BannedContinentCard";
import BannedNationalityCard from "./BannedNationalityCard";

export default function BannedForm() {
  const [bannedCountries, setBannedCountries] = useState<BannedCountryView[]>(
    []
  );
  const [bannedContinents, setBannedContinents] = useState<
    BannedContinentView[]
  >([]);
  const [bannedNationality, setBannedNationality] = useState<
    BannedNationalityView[]
  >([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [nationalities, setNationalities] = useState<Nationality[]>([]);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [accountStationOptions, setAccountStationOptions] = useState<
    AccountStationOption[]
  >([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<
    "Country" | "Continent" | "Nationality" | null
  >(null);

  const [countrySearchQuery, setCountrySearchQuery] = useState<string>("");
  const [nationalitySearchQuery, setNationalitySearchQuery] =
    useState<string>("");
  const [continentSearchQuery, setContinentSearchQuery] = useState<string>("");

  // Fetch all data initially
  const fetchData = async () => {
    const {
      bannedCountries,
      bannedContinents,
      bannedNationality,
      countries,
      nationalities,
      accountTypes,
      continents,
      accountStationOptions,
    } = await fetchAllBannedData();

    setBannedCountries(bannedCountries);
    setBannedContinents(bannedContinents);
    setBannedNationality(bannedNationality);
    setCountries(countries);
    setNationalities(nationalities);
    setAccountTypes(accountTypes);
    setContinents(continents);
    setAccountStationOptions(accountStationOptions);
  };

  useEffect(() => {
    fetchData();
  }, [update]);

  const handleUpdate = () => setUpdate((prev) => !prev);

  const handleOpenDialog = (type: "Country" | "Continent" | "Nationality") =>
    setOpenDialog(type);

  const handleCloseDialog = () => setOpenDialog(null);

  // Filtered lists based on search queries
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
  console.log(countries);

  return (
    <main>
      {/* Banned Countries */}
      <article className="px-10">
        <h2 className="font-bold text-xl text-center mb-8">Banned Countries</h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedCountries.length || "None"}</span>
          <div className="flex justify-center items-center gap-3">
            <input
              type="text"
              className="py-[.4rem] px-1 border rounded"
              placeholder="Search countries..."
              value={countrySearchQuery}
              onChange={(e) => setCountrySearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-900 block p-3"
              onClick={() => handleOpenDialog("Country")}
            >
              Add Banned Country
            </Button>
          </div>
        </div>
        <div className="mt-5 max-h-[35rem] overflow-y-scroll">
          {filteredBannedCountries.map((bannedCountry) => (
            <BannedCountryCard
              accountStationOptions={accountStationOptions}
              accountTypes={accountTypes}
              countries={countries}
              data={bannedCountry}
              key={bannedCountry.BannedCountryID}
              onDelete={handleUpdate}
            />
          ))}
        </div>
      </article>

      {/* Banned Nationalities */}
      <article className="p-10">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Nationalities
        </h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedNationalities.length || "None"}</span>
          <div className="flex justify-center items-center gap-3">
            <input
              type="text"
              className="py-[.4rem] px-1 border rounded"
              placeholder="Search nationalities..."
              value={nationalitySearchQuery}
              onChange={(e) => setNationalitySearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-900 block p-3"
              onClick={() => handleOpenDialog("Nationality")}
            >
              Add Banned Nationality
            </Button>
          </div>
        </div>
        <div className="mt-5 max-h-[35rem] overflow-y-scroll">
          {filteredBannedNationalities.map((bannedNationalit) => (
            <BannedNationalityCard
              accountStationOptions={accountStationOptions}
              accountTypes={accountTypes}
              nationalities={nationalities}
              data={bannedNationalit}
              key={bannedNationalit.BannedNationalityID}
              onDelete={handleUpdate}
            />
          ))}
        </div>
      </article>

      {/* Banned Continents */}
      <article className="p-10">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Continents
        </h2>
        <div className="flex justify-between items-center font-bold flex-col gap-5 sm:flex-row sm:gap-0">
          <span>Found: {filteredBannedContinents.length || "None"}</span>
          <div className="flex justify-center items-center gap-3 ">
            <input
              type="text"
              className="py-[.4rem] px-1 border rounded "
              placeholder="Search continents..."
              value={continentSearchQuery}
              onChange={(e) => setContinentSearchQuery(e.target.value)}
            />
            <Button
              className="bg-gray-900 block p-3"
              onClick={() => handleOpenDialog("Continent")}
            >
              Add Banned Continent
            </Button>
          </div>
        </div>

        <div className="mt-5 max-h-[35rem] overflow-y-scroll">
          {filteredBannedContinents.map((bannedContinent) => (
            <BannedContinentCard
              accountStationOptions={accountStationOptions}
              accountTypes={accountTypes}
              continents={continents}
              data={bannedContinent}
              key={bannedContinent.BannedContinentID}
              onDelete={handleUpdate}
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
        onAdd={handleUpdate}
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
        onAdd={handleUpdate}
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
        onAdd={handleUpdate}
      />
    </main>
  );
}
