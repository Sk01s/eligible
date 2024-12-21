import { handleDBError } from "@/lib/utils";
import { getDatabase } from "./db";
import { Nationality, NationalityInput } from "./dbTypes";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Insert a new nationality
export async function insertNationalityDataAccess({
  NationalityName,
}: NationalityInput): Promise<{
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
      `INSERT INTO Nationality (NationalityName) VALUES (?)`,
      [NationalityName]
    );

    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Insert multiple nationalities
export async function insertManyNationalitiesDataAccess(
  nationalities: Omit<Nationality, "NationalityID">[]
): Promise<{ success: boolean; insertedCount: number; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const statement = await db.prepare(
      `INSERT INTO Nationality (NationalityName) VALUES (?)`
    );

    let insertedCount = 0;

    for (const { NationalityName } of nationalities) {
      await statement.execute([NationalityName]); // Use execute instead of run
      insertedCount++;
    }

    return { success: true, insertedCount };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Update an existing nationality
export async function updateNationalityDataAccess(
  nationalityID: number,
  NationalityName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE Nationality SET NationalityName = ? WHERE NationalityID = ?`,
      [NationalityName, nationalityID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete a nationality
export async function deleteNationalityDataAccess(
  nationalityID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );

    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Get all nationalities
export async function getAllNationalitiesDataAccess(): Promise<Nationality[]> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM Nationality"
    );
    return rows as Nationality[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete all nationalities
export async function deleteAllNationalitiesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM Nationality"
    );
    const changes = result.affectedRows ?? 0; // Fallback to 0 if changes is undefined

    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Find a nationality by its ID
export async function findNationalityDataAccess(
  nationalityID: number
): Promise<Nationality | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );
    return rows.length > 0 ? (rows[0] as Nationality) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if a nationality exists by its ID
export async function doesNationalityExistDataAccess(
  nationalityID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1 FROM Nationality WHERE NationalityID = ?`,
      [nationalityID]
    );
    return rows.length > 0; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
