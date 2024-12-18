import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { AccountStationOption, AccountStationOptionInput } from "./dbTypes";

// Insert a new account station option
export async function insertAccountStationOptionDataAccess({
  AccountStationOptionName,
}: AccountStationOptionInput): Promise<{
  success: boolean;
  lastID?: number;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `INSERT INTO AccountStationOptions (AccountStationOptionName) VALUES (?)`,
      [AccountStationOptionName]
    );

    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Update an existing account station option
export async function updateAccountStationOptionDataAccess(
  accountStationOptionID: number,
  AccountStationOptionName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `UPDATE AccountStationOptions SET AccountStationOptionName = ? WHERE AccountStationOptionID = ?`,
      [AccountStationOptionName, accountStationOptionID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete a specific account station option
export async function deleteAccountStationOptionDataAccess(
  accountStationOptionID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `DELETE FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Get all account station options
export async function getAllAccountStationOptionsDataAccess(): Promise<
  AccountStationOption[]
> {
  const db = await getDatabase();

  try {
    const rows = await db.all(`SELECT * FROM AccountStationOptions`);
    return rows as AccountStationOption[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete all account station options
export async function deleteAllAccountStationOptionsDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(`DELETE FROM AccountStationOptions`);
    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Find an account station option by its ID
export async function findAccountStationOptionDataAccess(
  accountStationOptionID: number
): Promise<AccountStationOption | null> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT * FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );
    return row ? (row as AccountStationOption) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if an account station option exists by its ID
export async function doesAccountStationOptionExistDataAccess(
  accountStationOptionID: number
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT 1 FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );
    return !!row; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
