import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { Continent } from "./dbTypes";

// Function to insert a continent
export async function insertContinentDataAccess(
  continentName: string
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "INSERT INTO Continents (ContinentName) VALUES (?)",
      [continentName]
    );
    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Insert multiple continents
export async function insertManyContinentsDataAccess(
  continents: string[]
): Promise<{ success: boolean; insertedCount: number; error?: string }> {
  const db = await getDatabase();

  try {
    const statement = await db.prepare(
      "INSERT INTO Continents (ContinentName) VALUES (?)"
    );

    let insertedCount = 0;

    for (const continentName of continents) {
      await statement.run([continentName]);
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

// Function to update a continent
export async function updateContinentDataAccess(
  continentID: number,
  continentName: string
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "UPDATE Continents SET ContinentName = ? WHERE ContinentID = ?",
      [continentName, continentID]
    );

    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to delete a continent
export async function deleteContinentDataAccess(
  continentID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "DELETE FROM Continents WHERE ContinentID = ?",
      [continentID]
    );

    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to fetch all continents
export async function getAllContinentsDataAccess(): Promise<Continent[]> {
  const db = await getDatabase();
  try {
    const rows = await db.all("SELECT * FROM Continents");
    return rows as Continent[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to delete all continents
export async function deleteAllContinentsDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  try {
    const result = await db.run("DELETE FROM Continents");
    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to find a specific continent by ID
export async function findContinentDataAccess(
  continentID: number
): Promise<Continent | null> {
  const db = await getDatabase();

  try {
    const row = await db.get("SELECT * FROM Continents WHERE ContinentID = ?", [
      continentID,
    ]);
    return row ? (row as Continent) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a continent exists by its ID
export async function doesContinentExistDataAccess(
  continentID: number
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const row = await db.get("SELECT 1 FROM Continents WHERE ContinentID = ?", [
      continentID,
    ]);
    return !!row; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
