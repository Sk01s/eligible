"use server";

import {
  insertContinentDataAccess,
  updateContinentDataAccess,
  deleteContinentDataAccess,
  getAllContinentsDataAccess,
  deleteAllContinentsDataAccess,
  findContinentDataAccess,
  doesContinentExistDataAccess,
} from "@/db/continent";
import { Continent, ContinentInput } from "@/db/dbTypes";

// Fetch all continents
export async function getAllContinents(): Promise<Continent[]> {
  return await getAllContinentsDataAccess();
}

// Insert a new continent
export async function insertContinent(
  continentInput: ContinentInput
): Promise<{ success: boolean; lastID?: number }> {
  const result = await insertContinentDataAccess(continentInput.ContinentName);

  if (!result.success) {
    throw new Error(result.error || "Failed to insert continent.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update a continent
export async function updateContinent(
  continentID: number,
  continentName: string
): Promise<{ success: boolean }> {
  const result = await updateContinentDataAccess(continentID, continentName);

  if (!result.success) {
    throw new Error(
      result.error || `Failed to update continent with ID ${continentID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific continent
export async function deleteContinent(
  continentID: number
): Promise<{ success: boolean }> {
  const result = await deleteContinentDataAccess(continentID);

  if (!result.success) {
    throw new Error(
      result.error || `Failed to delete continent with ID ${continentID}.`
    );
  }

  return { success: result.success };
}

// Delete all continents
export async function deleteAllContinents(): Promise<{ success: boolean }> {
  const result = await deleteAllContinentsDataAccess();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete all continents.");
  }

  return { success: result.success };
}

// Find a continent by ID
export async function findContinent(
  continentID: number
): Promise<Continent | null> {
  return await findContinentDataAccess(continentID);
}

// Check if a continent exists by its ID
export async function doesContinentExist(
  continentID: number
): Promise<boolean> {
  return await doesContinentExistDataAccess(continentID);
}
