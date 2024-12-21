"use server";

import {
  insertBannedCountryDataAccess,
  updateBannedCountryDataAccess,
  deleteBannedCountryDataAccess,
  getAllBannedCountriesDataAccess,
  viewBannedCountryDataAccess,
  viewAllBannedCountriesDataAccess,
  doesBannedCountryExistDataAccess,
} from "@/db/bannedCountry"; // Update the import path if needed
import {
  BannedCountry,
  BannedCountryInput,
  BannedCountryView,
} from "@/db/dbTypes";

// Helper function to format date to YYYY-MM-DD
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extracts the date part in YYYY-MM-DD format
}

// Fetch all banned countries
export async function getAllBannedCountries(): Promise<BannedCountry[]> {
  const bannedCountries = await getAllBannedCountriesDataAccess();
  return bannedCountries.map((country) => ({
    ...country,
    BannedCountryDate: formatDate(country.BannedCountryDate),
  }));
}

// View a specific banned country with joined fields
export async function viewBannedCountry(
  bannedCountryID: number
): Promise<BannedCountryView | null> {
  const bannedCountry = await viewBannedCountryDataAccess(bannedCountryID);
  if (bannedCountry) {
    return {
      ...bannedCountry,
      BannedCountryDate: formatDate(bannedCountry.BannedCountryDate),
    };
  }
  return null;
}

// View all banned countries with joined fields
export async function viewAllBannedCountries(): Promise<BannedCountryView[]> {
  const bannedCountries = await viewAllBannedCountriesDataAccess();
  return bannedCountries?.map((country) => ({
    ...country,
    BannedCountryDate: formatDate(country.BannedCountryDate),
  }));
}

// Insert a new banned country
export async function insertBannedCountry(
  input: Omit<BannedCountryInput, "BannedCountryDate">
): Promise<{ success: boolean; lastID?: number }> {
  const currentDate = new Date()
    .toISOString()
    .slice(0, 19) // Get the `YYYY-MM-DDTHH:mm:ss` part
    .replace("T", " "); // Replace `T` with a space to match MySQL's DATETIME format

  const result = await insertBannedCountryDataAccess({
    ...input,
    BannedCountryDate: currentDate,
  });

  if (!result.success) {
    throw new Error(result.error || "Failed to insert banned country.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update an existing banned country
export async function updateBannedCountry(
  bannedCountryID: number,
  input: Omit<BannedCountryInput, "BannedCountryDate">
): Promise<{ success: boolean }> {
  const currentDate = new Date()
    .toISOString()
    .slice(0, 19) // Get the `YYYY-MM-DDTHH:mm:ss` part
    .replace("T", " "); // Replace `T` with a space to match MySQL's DATETIME format
  const result = await updateBannedCountryDataAccess(bannedCountryID, {
    ...input,
    BannedCountryDate: currentDate,
  });

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to update banned country with ID ${bannedCountryID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific banned country
export async function deleteBannedCountry(
  bannedCountryID: number
): Promise<{ success: boolean }> {
  const result = await deleteBannedCountryDataAccess(bannedCountryID);

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to delete banned country with ID ${bannedCountryID}.`
    );
  }

  return { success: result.success };
}

// Check if a banned country exists by its ID
export async function doesBannedCountryExist(
  bannedCountryID: number
): Promise<boolean> {
  return await doesBannedCountryExistDataAccess(bannedCountryID);
}
