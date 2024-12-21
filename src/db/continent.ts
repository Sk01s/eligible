import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { Continent } from "./dbTypes";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Function to insert a continent
export async function insertContinentDataAccess(
  continentName: string
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO Continents (ContinentName) VALUES (?)",
      [continentName]
    );
    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Insert multiple continents
export async function insertManyContinentsDataAccess(
  continents: string[]
): Promise<{ success: boolean; insertedCount: number; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    let insertedCount = 0;

    for (const continentName of continents) {
      const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO Continents (ContinentName) VALUES (?)",
        [continentName]
      );
      if (result.affectedRows > 0) {
        insertedCount++;
      }
    }

    return { success: true, insertedCount };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Function to update a continent
export async function updateContinentDataAccess(
  continentID: number,
  continentName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE Continents SET ContinentName = ? WHERE ContinentID = ?",
      [continentName, continentID]
    );

    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Function to delete a continent
export async function deleteContinentDataAccess(
  continentID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM Continents WHERE ContinentID = ?",
      [continentID]
    );

    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Function to fetch all continents
export async function getAllContinentsDataAccess(): Promise<Continent[]> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM Continents"
    );
    return rows as Continent[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Function to delete all continents
export async function deleteAllContinentsDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM Continents"
    );
    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Function to find a specific continent by ID
export async function findContinentDataAccess(
  continentID: number
): Promise<Continent | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM Continents WHERE ContinentID = ?",
      [continentID]
    );
    return rows.length > 0 ? (rows[0] as Continent) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if a continent exists by its ID
export async function doesContinentExistDataAccess(
  continentID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM Continents WHERE ContinentID = ?",
      [continentID]
    );
    return rows.length > 0; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
