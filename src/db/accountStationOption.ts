import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { AccountStationOption, AccountStationOptionInput } from "./dbTypes";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Insert a new account station option
export async function insertAccountStationOptionDataAccess({
  AccountStationOptionName,
}: AccountStationOptionInput): Promise<{
  success: boolean;
  lastID?: number;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO AccountStationOptions (AccountStationOptionName) VALUES (?)`,
      [AccountStationOptionName]
    );

    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Update an existing account station option
export async function updateAccountStationOptionDataAccess(
  accountStationOptionID: number,
  AccountStationOptionName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE AccountStationOptions SET AccountStationOptionName = ? WHERE AccountStationOptionID = ?`,
      [AccountStationOptionName, accountStationOptionID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete a specific account station option
export async function deleteAccountStationOptionDataAccess(
  accountStationOptionID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Get all account station options
export async function getAllAccountStationOptionsDataAccess(): Promise<
  AccountStationOption[]
> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM AccountStationOptions"
    );
    return rows as AccountStationOption[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete all account station options
export async function deleteAllAccountStationOptionsDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM AccountStationOptions"
    );
    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Find an account station option by its ID
export async function findAccountStationOptionDataAccess(
  accountStationOptionID: number
): Promise<AccountStationOption | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );
    return rows.length > 0 ? (rows[0] as AccountStationOption) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if an account station option exists by its ID
export async function doesAccountStationOptionExistDataAccess(
  accountStationOptionID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1 FROM AccountStationOptions WHERE AccountStationOptionID = ?`,
      [accountStationOptionID]
    );
    return rows.length > 0; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
