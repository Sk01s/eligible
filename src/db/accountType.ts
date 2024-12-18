import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { AccountType, AccountTypeInput } from "./dbTypes";

// Insert a new account type
export async function insertAccountTypeDataAccess({
  AccountTypeName,
}: AccountTypeInput): Promise<{
  success: boolean;
  lastID?: number;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `INSERT INTO AccountTypes (AccountTypeName) VALUES (?)`,
      [AccountTypeName]
    );

    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
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

  try {
    const statement = await db.prepare(
      `INSERT INTO AccountTypes (AccountTypeName) VALUES (?)`
    );

    let insertedCount = 0;

    for (const { AccountTypeName } of accountTypes) {
      await statement.run([AccountTypeName]);
      insertedCount++;
    }

    await statement.finalize();
    return { success: true, insertedCount };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Update an existing account type
export async function updateAccountTypeDataAccess(
  accountTypeID: number,
  AccountTypeName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `UPDATE AccountTypes SET AccountTypeName = ? WHERE AccountTypeID = ?`,
      [AccountTypeName, accountTypeID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete an account type
export async function deleteAccountTypeDataAccess(
  accountTypeID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `DELETE FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Get all account types
export async function getAllAccountTypesDataAccess(): Promise<AccountType[]> {
  const db = await getDatabase();

  try {
    const rows = await db.all(`SELECT * FROM AccountTypes`);
    return rows as AccountType[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete all account types
export async function deleteAllAccountTypesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(`DELETE FROM AccountTypes`);
    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Find an account type by its ID
export async function findAccountTypeDataAccess(
  accountTypeID: number
): Promise<AccountType | null> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT * FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );
    return row ? (row as AccountType) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if an account type exists by its ID
export async function doesAccountTypeExistDataAccess(
  accountTypeID: number
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT 1 FROM AccountTypes WHERE AccountTypeID = ?`,
      [accountTypeID]
    );
    return !!row; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
