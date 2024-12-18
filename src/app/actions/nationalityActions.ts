"use server";

import {
  insertNationalityDataAccess,
  updateNationalityDataAccess,
  deleteNationalityDataAccess,
  getAllNationalitiesDataAccess,
  deleteAllNationalitiesDataAccess,
  findNationalityDataAccess,
  doesNationalityExistDataAccess,
  insertManyNationalitiesDataAccess,
} from "@/db/nationality";
import { Nationality, NationalityInput } from "@/db/dbTypes";

// Fetch all nationalities
export async function getAllNationalities(): Promise<Nationality[]> {
  return await getAllNationalitiesDataAccess();
}

// Insert a new nationality
export async function insertNationality(
  nationalityInput: NationalityInput
): Promise<{ success: boolean; lastID?: number }> {
  const result = await insertNationalityDataAccess(nationalityInput);

  if (!result.success) {
    throw new Error(result.error || "Failed to insert nationality.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Insert multiple nationalities
export async function insertManyNationalities(
  nationalities: Omit<Nationality, "NationalityID">[]
): Promise<{ success: boolean; insertedCount: number }> {
  const result = await insertManyNationalitiesDataAccess(nationalities);

  if (!result.success) {
    throw new Error(result.error || "Failed to insert multiple nationalities.");
  }

  return { success: result.success, insertedCount: result.insertedCount };
}

// Update an existing nationality
export async function updateNationality(
  nationalityID: number,
  NationalityName: string
): Promise<{ success: boolean }> {
  const result = await updateNationalityDataAccess(
    nationalityID,
    NationalityName
  );

  if (!result.success) {
    throw new Error(
      result.error || `Failed to update nationality with ID ${nationalityID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific nationality
export async function deleteNationality(
  nationalityID: number
): Promise<{ success: boolean }> {
  const result = await deleteNationalityDataAccess(nationalityID);

  if (!result.success) {
    throw new Error(
      result.error || `Failed to delete nationality with ID ${nationalityID}.`
    );
  }

  return { success: result.success };
}

// Delete all nationalities
export async function deleteAllNationalities(): Promise<{ success: boolean }> {
  const result = await deleteAllNationalitiesDataAccess();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete all nationalities.");
  }

  return { success: result.success };
}

// Find a nationality by ID
export async function findNationality(
  nationalityID: number
): Promise<Nationality | null> {
  return await findNationalityDataAccess(nationalityID);
}

// Check if a nationality exists by its ID
export async function doesNationalityExist(
  nationalityID: number
): Promise<boolean> {
  return await doesNationalityExistDataAccess(nationalityID);
}
