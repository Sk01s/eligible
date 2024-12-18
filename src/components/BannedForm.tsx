"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button component
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
  const [update, setUpdate] = useState<boolean>(false);
  const [accountStationOptions, setAccountStationOptions] = useState<
    AccountStationOption[]
  >([]);

  const [openDialog, setOpenDialog] = useState<
    "Country" | "Continent" | "Nationality" | null
  >(null);

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
    } = await fetchAllBannedData(); // Centralized API call

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
    fetchData(); // Load initial data on component mount
  }, [update]);
  const handleUpdate = () => {
    setUpdate((prev) => !prev);
  };

  const handleOpenDialog = (type: "Country" | "Continent" | "Nationality") => {
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  return (
    <main>
      <article className="p-10">
        <h2 className="font-bold text-xl text-center mb-8">Banned Countries</h2>
        <div className="flex justify-between items-center font-bold">
          <span>Found:{bannedCountries.length || "None"}</span>
          <Button
            className="bg-gray-900 p-3"
            onClick={() => handleOpenDialog("Country")}
          >
            Add Banned Country
          </Button>
        </div>
        <div className="mt-5">
          {bannedCountries.map((bannedCounty) => (
            <BannedCountryCard
              accountStationOptions={accountStationOptions}
              accountTypes={accountTypes}
              countries={countries}
              data={bannedCounty}
              key={bannedCounty.BannedCountryID}
              onDelete={handleUpdate}
            />
          ))}
        </div>
      </article>
      <article className="p-10">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Continents
        </h2>
        <div className="flex justify-between items-center font-bold">
          <span>Found:{bannedContinents.length || "None"}</span>
          <Button
            className="bg-gray-900 block p-3 "
            onClick={() => handleOpenDialog("Continent")}
          >
            Add Banned Continent
          </Button>
        </div>
        <div className="mt-5">
          {bannedContinents.map((bannedContinent) => (
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
      <article className="p-10">
        <h2 className="font-bold text-xl text-center mb-8">
          Banned Nationalities
        </h2>
        <div className="flex justify-between items-center font-bold">
          <span>Found:{bannedNationality.length || "None"}</span>
          <Button
            className="bg-gray-900 block p-3 "
            onClick={() => handleOpenDialog("Nationality")}
          >
            Add Banned Nationality
          </Button>
        </div>
        <div className="mt-5">
          {bannedNationality.map((bannedNationalit) => (
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
