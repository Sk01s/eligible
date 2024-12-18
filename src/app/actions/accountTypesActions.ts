"use server";

import {
  insertAccountTypeDataAccess,
  updateAccountTypeDataAccess,
  deleteAccountTypeDataAccess,
  getAllAccountTypesDataAccess,
  deleteAllAccountTypesDataAccess,
  findAccountTypeDataAccess,
  doesAccountTypeExistDataAccess,
} from "@/db/accountType"; // Ensure to update the import path
import { AccountType, AccountTypeInput } from "@/db/dbTypes"; // Ensure AccountType is correctly imported

// Fetch all account types
export async function getAllAccountTypes(): Promise<AccountType[]> {
  return await getAllAccountTypesDataAccess();
}

// Insert a new account type
export async function insertAccountType(
  accountTypeInput: AccountTypeInput
): Promise<{ success: boolean; lastID?: number }> {
  const result = await insertAccountTypeDataAccess(accountTypeInput);

  if (!result.success) {
    throw new Error(result.error || "Failed to insert account type.");
  }

  return { success: result.success, lastID: result.lastID };
}

// Update an account type
export async function updateAccountType(
  accountTypeID: number,
  AccountTypeName: string
): Promise<{ success: boolean }> {
  const result = await updateAccountTypeDataAccess(
    accountTypeID,
    AccountTypeName
  );

  if (!result.success) {
    throw new Error(
      result.error || `Failed to update account type with ID ${accountTypeID}.`
    );
  }

  return { success: result.success };
}

// Delete a specific account type
export async function deleteAccountType(
  accountTypeID: number
): Promise<{ success: boolean }> {
  const result = await deleteAccountTypeDataAccess(accountTypeID);

  if (!result.success) {
    throw new Error(
      result.error || `Failed to delete account type with ID ${accountTypeID}.`
    );
  }

  return { success: result.success };
}

// Delete all account types
export async function deleteAllAccountTypes(): Promise<{ success: boolean }> {
  const result = await deleteAllAccountTypesDataAccess();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete all account types.");
  }

  return { success: result.success };
}

// Find an account type by ID
export async function findAccountType(
  accountTypeID: number
): Promise<AccountType | null> {
  return await findAccountTypeDataAccess(accountTypeID);
}

// Check if an account type exists by its ID
export async function doesAccountTypeExist(
  accountTypeID: number
): Promise<boolean> {
  return await doesAccountTypeExistDataAccess(accountTypeID);
}
