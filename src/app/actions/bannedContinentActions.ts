"use server";

import {
  insertBannedContinentDataAccess,
  updateBannedContinentDataAccess,
  deleteBannedContinentDataAccess,
  getAllBannedContinentsDataAccess,
  viewBannedContinentDataAccess,
  viewAllBannedContinentsDataAccess,
  doesBannedContinentExistDataAccess,
} from "@/db/bannedContinent"; // Update the import path if needed
import {
  BannedContinent,
  BannedContinentInput,
  BannedContinentView,
} from "@/db/dbTypes";

// Helper function to format date to YYYY-MM-DD
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extracts the date part in YYYY-MM-DD format
}

// Fetch all banned continents
export async function getAllBannedContinents(): Promise<BannedContinent[]> {
  const bannedContinents = await getAllBannedContinentsDataAccess();
  return bannedContinents.map((continent) => ({
    ...continent,
    BannedContinentDate: formatDate(continent.BannedContinentDate),
  }));
}

// View a specific banned continent with joined fields
export async function viewBannedContinent(
  bannedContinentID: number
): Promise<BannedContinentView | null> {
  const bannedContinent = await viewBannedContinentDataAccess(
    bannedContinentID
  );
  if (bannedContinent) {
    return {
      ...bannedContinent,
      BannedContinentDate: formatDate(bannedContinent.BannedContinentDate),
    };
  }
  return null;
}

// View all banned continents with joined fields
export async function viewAllBannedContinents(): Promise<
  BannedContinentView[]
> {
  const bannedContinents = await viewAllBannedContinentsDataAccess();
  return bannedContinents?.map((continent) => ({
    ...continent,
    BannedContinentDate: formatDate(continent.BannedContinentDate),
  }));
}

// Insert a new banned continent
export async function insertBannedContinent(
  input: Omit<BannedContinentInput, "BannedContinentDate">
): Promise<{ success: boolean; lastID?: number }> {
  const currentDate = new Date().toISOString(); // Current date in ISO format
  const result = await insertBannedContinentDataAccess({
    ...input,
    BannedContinentDate: currentDate,
  });

  if (!result.success) {
    throw new Error(result.error || "Failed to insert banned continent.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update an existing banned continent
export async function updateBannedContinent(
  bannedContinentID: number,
  input: Omit<BannedContinentInput, "BannedContinentDate">
): Promise<{ success: boolean }> {
  const currentDate = new Date().toISOString(); // Current date in ISO format
  const result = await updateBannedContinentDataAccess(bannedContinentID, {
    ...input,
    BannedContinentDate: currentDate,
  });

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to update banned continent with ID ${bannedContinentID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific banned continent
export async function deleteBannedContinent(
  bannedContinentID: number
): Promise<{ success: boolean }> {
  const result = await deleteBannedContinentDataAccess(bannedContinentID);

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to delete banned continent with ID ${bannedContinentID}.`
    );
  }

  return { success: result.success };
}

// Check if a banned continent exists by its ID
export async function doesBannedContinentExist(
  bannedContinentID: number
): Promise<boolean> {
  return await doesBannedContinentExistDataAccess(bannedContinentID);
}
