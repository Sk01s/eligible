import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { AccountType, AccountTypeInput } from "./dbTypes";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Insert a new account type
export async function insertAccountTypeDataAccess({
  AccountTypeName,
}: AccountTypeInput): Promise<{
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
      `INSERT INTO AccountTypes (AccountTypeName) VALUES (?)`,
      [AccountTypeName]
    );

    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Insert multiple account types
export async function insertManyAccountTypesDataAccess(
  accountTypes: Omit<AccountType, "AccountTypeID">[]
): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const statement = await db.prepare(
      `INSERT INTO AccountTypes (AccountTypeName) VALUES (?)`
    );

    let insertedCount = 0;

    for (const { AccountTypeName } of accountTypes) {
      await statement.execute([AccountTypeName]); // Use execute instead of run
      insertedCount++;
    }

    return { success: true, insertedCount };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Update an existing account type
export async function updateAccountTypeDataAccess(
  accountTypeID: number,
  AccountTypeName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE AccountTypes SET AccountTypeName = ? WHERE AccountTypeID = ?`,
      [AccountTypeName, accountTypeID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete an account type
export async function deleteAccountTypeDataAccess(
  accountTypeID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Get all account types
export async function getAllAccountTypesDataAccess(): Promise<AccountType[]> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM AccountTypes"
    );
    return rows as AccountType[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete all account types
export async function deleteAllAccountTypesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM AccountTypes"
    );
    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Find an account type by its ID
export async function findAccountTypeDataAccess(
  accountTypeID: number
): Promise<AccountType | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );
    return rows.length > 0 ? (rows[0] as AccountType) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if an account type exists by its ID
export async function doesAccountTypeExistDataAccess(
  accountTypeID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1 FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );
    return rows.length > 0; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
