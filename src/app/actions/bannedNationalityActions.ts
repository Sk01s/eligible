"use server";

import {
  insertBannedNationalityDataAccess,
  updateBannedNationalityDataAccess,
  deleteBannedNationalityDataAccess,
  getAllBannedNationalitiesDataAccess,
  viewBannedNationalityDataAccess,
  viewAllBannedNationalitiesDataAccess,
  doesBannedNationalityExistDataAccess,
} from "@/db/bannedNationality"; // Update the import path if needed
import {
  BannedNationality,
  BannedNationalityInput,
  BannedNationalityView,
} from "@/db/dbTypes";

// Helper function to format date to YYYY-MM-DD
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extracts the date part in YYYY-MM-DD format
}

// Fetch all banned nationalities
export async function getAllBannedNationalities(): Promise<
  BannedNationality[]
> {
  const bannedNationalities = await getAllBannedNationalitiesDataAccess();
  return bannedNationalities.map((nationality) => ({
    ...nationality,
    BannedNationalityDate: formatDate(nationality.BannedNationalityDate),
  }));
}

// View a specific banned nationality with joined fields
export async function viewBannedNationality(
  bannedNationalityID: number
): Promise<BannedNationalityView | null> {
  const bannedNationality = await viewBannedNationalityDataAccess(
    bannedNationalityID
  );
  if (bannedNationality) {
    return {
      ...bannedNationality,
      BannedNationalityDate: formatDate(
        bannedNationality.BannedNationalityDate
      ),
    };
  }
  return null;
}

// View all banned nationalities with joined fields
export async function viewAllBannedNationalities(): Promise<
  BannedNationalityView[]
> {
  const bannedNationalities = await viewAllBannedNationalitiesDataAccess();
  return bannedNationalities?.map((nationality) => ({
    ...nationality,
    BannedNationalityDate: formatDate(nationality.BannedNationalityDate),
  }));
}

// Insert a new banned nationality
export async function insertBannedNationality(
  input: Omit<BannedNationalityInput, "BannedNationalityDate">
): Promise<{ success: boolean; lastID?: number }> {
  const currentDate = new Date().toISOString(); // Current date in ISO format
  const result = await insertBannedNationalityDataAccess({
    ...input,
    BannedNationalityDate: currentDate,
  });

  if (!result.success) {
    throw new Error(result.error || "Failed to insert banned nationality.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update an existing banned nationality
export async function updateBannedNationality(
  bannedNationalityID: number,
  input: Omit<BannedNationalityInput, "BannedNationalityDate">
): Promise<{ success: boolean }> {
  const currentDate = new Date().toISOString(); // Current date in ISO format
  const result = await updateBannedNationalityDataAccess(bannedNationalityID, {
    ...input,
    BannedNationalityDate: currentDate,
  });

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to update banned nationality with ID ${bannedNationalityID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific banned nationality
export async function deleteBannedNationality(
  bannedNationalityID: number
): Promise<{ success: boolean }> {
  const result = await deleteBannedNationalityDataAccess(bannedNationalityID);

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to delete banned nationality with ID ${bannedNationalityID}.`
    );
  }

  return { success: result.success };
}

// Check if a banned nationality exists by its ID
export async function doesBannedNationalityExist(
  bannedNationalityID: number
): Promise<boolean> {
  return await doesBannedNationalityExistDataAccess(bannedNationalityID);
}
