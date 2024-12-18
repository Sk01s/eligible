"use server";

import {
  insertAccountStationOptionDataAccess,
  deleteAccountStationOptionDataAccess,
  getAllAccountStationOptionsDataAccess,
  updateAccountStationOptionDataAccess,
  deleteAllAccountStationOptionsDataAccess,
  findAccountStationOptionDataAccess,
  doesAccountStationOptionExistDataAccess,
} from "@/db/accountStationOption"; // Ensure the correct import path
import { AccountStationOption, AccountStationOptionInput } from "@/db/dbTypes";

// Fetch all account station options
export async function getAllAccountStationOptions(): Promise<
  AccountStationOption[]
> {
  return await getAllAccountStationOptionsDataAccess();
}

// Insert a new account station option
export async function insertAccountStationOption(
  accountStationOptionInput: AccountStationOptionInput
): Promise<{ success: boolean; lastID?: number }> {
  const result = await insertAccountStationOptionDataAccess(
    accountStationOptionInput
  );

  if (!result.success) {
    throw new Error(result.error || "Failed to insert account station option.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update an account station option
export async function updateAccountStationOption(
  accountStationOptionID: number,
  AccountStationOptionName: string
): Promise<{ success: boolean }> {
  const result = await updateAccountStationOptionDataAccess(
    accountStationOptionID,
    AccountStationOptionName
  );

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to update account station option with ID ${accountStationOptionID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific account station option
export async function deleteAccountStationOption(
  accountStationOptionID: number
): Promise<{ success: boolean }> {
  const result = await deleteAccountStationOptionDataAccess(
    accountStationOptionID
  );

  if (!result.success) {
    throw new Error(
      result.error ||
        `Failed to delete account station option with ID ${accountStationOptionID}.`
    );
  }

  return { success: result.success };
}

// Delete all account station options
export async function deleteAllAccountStationOptions(): Promise<{
  success: boolean;
}> {
  const result = await deleteAllAccountStationOptionsDataAccess();

  if (!result.success) {
    throw new Error(
      result.error || "Failed to delete all account station options."
    );
  }

  return { success: result.success };
}

// Find an account station option by ID
export async function findAccountStationOption(
  accountStationOptionID: number
): Promise<AccountStationOption | null> {
  return await findAccountStationOptionDataAccess(accountStationOptionID);
}

// Check if an account station option exists by its ID
export async function doesAccountStationOptionExist(
  accountStationOptionID: number
): Promise<boolean> {
  return await doesAccountStationOptionExistDataAccess(accountStationOptionID);
}
