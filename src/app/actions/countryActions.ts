"use server";

import {
  insertCountryDataAccess,
  updateCountryDataAccess,
  deleteCountryDataAccess,
  getAllCountriesDataAccess,
  deleteAllCountriesDataAccess,
  findCountryDataAccess,
  doesCountryExistDataAccess,
} from "@/db/country";
import { Country, CountryInput } from "@/db/dbTypes";

// Fetch all countries
export async function getAllCountries(): Promise<Country[]> {
  return await getAllCountriesDataAccess();
}

// Insert a new country
export async function insertCountry(
  countryInput: CountryInput
): Promise<{ success: boolean; lastID?: number }> {
  const result = await insertCountryDataAccess(countryInput);

  if (!result.success) {
    throw new Error(result.error || "Failed to insert country.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update a country
export async function updateCountry(
  CountryID: number,
  CountryName: string,
  Code: string,
  ContinentID: number
): Promise<{ success: boolean }> {
  const result = await updateCountryDataAccess(
    CountryID,
    CountryName,
    Code,
    ContinentID
  );

  if (!result.success) {
    throw new Error(
      result.error || `Failed to update country with ID ${CountryID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific country
export async function deleteCountry(
  CountryID: number
): Promise<{ success: boolean }> {
  const result = await deleteCountryDataAccess(CountryID);

  if (!result.success) {
    throw new Error(
      result.error || `Failed to delete country with ID ${CountryID}.`
    );
  }

  return { success: result.success };
}

// Delete all countries
export async function deleteAllCountries(): Promise<{ success: boolean }> {
  const result = await deleteAllCountriesDataAccess();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete all countries.");
  }

  return { success: result.success };
}

// Find a country by ID
export async function findCountry(CountryID: number): Promise<Country | null> {
  return await findCountryDataAccess(CountryID);
}

// Check if a country exists by its ID
export async function doesCountryExist(CountryID: number): Promise<boolean> {
  return await doesCountryExistDataAccess(CountryID);
}
