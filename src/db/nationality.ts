import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { Nationality, NationalityInput } from "./dbTypes";

// Insert a new nationality
export async function insertNationalityDataAccess({
  NationalityName,
}: NationalityInput): Promise<{
  success: boolean;
  lastID?: number;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `INSERT INTO Nationality (NationalityName) VALUES (?)`,
      [NationalityName]
    );

    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Insert multiple nationalities
export async function insertManyNationalitiesDataAccess(
  nationalities: Omit<Nationality, "NationalityID">[]
): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const statement = await db.prepare(
      `INSERT INTO Nationality (NationalityName) VALUES (?)`
    );

    let insertedCount = 0;

    for (const { NationalityName } of nationalities) {
      await statement.run([NationalityName]);
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

// Update an existing nationality
export async function updateNationalityDataAccess(
  nationalityID: number,
  NationalityName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `UPDATE Nationality SET NationalityName = ? WHERE NationalityID = ?`,
      [NationalityName, nationalityID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete a nationality
export async function deleteNationalityDataAccess(
  nationalityID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();

  try {
    const result = await db.run(
      `DELETE FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );

    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Get all nationalities
export async function getAllNationalitiesDataAccess(): Promise<Nationality[]> {
  const db = await getDatabase();

  try {
    const rows = await db.all(`SELECT * FROM Nationality`);
    return rows as Nationality[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete all nationalities
export async function deleteAllNationalitiesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const result = await db.run(`DELETE FROM Nationality`);
    const changes = result.changes ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Find a nationality by its ID
export async function findNationalityDataAccess(
  nationalityID: number
): Promise<Nationality | null> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT * FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );
    return row ? (row as Nationality) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a nationality exists by its ID
export async function doesNationalityExistDataAccess(
  nationalityID: number
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const row = await db.get(
      `SELECT 1 FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );
    return !!row; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
