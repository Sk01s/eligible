import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import { Country, CountryInput } from "./dbTypes";

// Function to insert a country
export async function insertCountryDataAccess({
  Code,
  CountryName,
  ContinentID, // Add ContinentID to input
}: CountryInput & { ContinentID: number }): Promise<{
  success: boolean;
  lastID?: number;
  error?: string;
}> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "INSERT INTO Countries (Code, CountryName, ContinentID) VALUES (?, ?, ?)",
      [Code, CountryName, ContinentID]
    );
    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Insert multiple countries
export async function insertManyCountriesDataAccess(
  countries: Omit<Country, "CountryID">[]
): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  const db = await getDatabase();

  try {
    const statement = await db.prepare(
      `INSERT INTO Countries (Code, CountryName, ContinentID) VALUES (?, ?, ?)`
    );

    let insertedCount = 0;

    for (const { Code, CountryName, ContinentID } of countries) {
      await statement.run([Code, CountryName, ContinentID]);
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

// Function to update a country
export async function updateCountryDataAccess(
  countryID: number,
  code: string,
  countryName: string,
  continentID: number // Add ContinentID to update
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "UPDATE Countries SET Code = ?, CountryName = ?, ContinentID = ? WHERE CountryID = ?",
      [code, countryName, continentID, countryID]
    );

    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to delete a country
export async function deleteCountryDataAccess(
  countryID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run("DELETE FROM Countries WHERE CountryID = ?", [
      countryID,
    ]);

    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to fetch all countries
export async function getAllCountriesDataAccess(): Promise<Country[]> {
  const db = await getDatabase();
  try {
    const rows = await db.all("SELECT * FROM Countries");
    return rows as Country[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Function to delete all countries
export async function deleteAllCountriesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  try {
    const result = await db.run("DELETE FROM Countries");
    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

export async function findCountryDataAccess(
  countryID: number
): Promise<Country | null> {
  const db = await getDatabase();

  try {
    const row = await db.get(`SELECT * FROM Countries WHERE CountryID = ?`, [
      countryID,
    ]);
    return row ? (row as Country) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a country exists by its ID
export async function doesCountryExistDataAccess(
  countryID: number
): Promise<boolean> {
  const db = await getDatabase();

  try {
    const row = await db.get(`SELECT 1 FROM Countries WHERE CountryID = ?`, [
      countryID,
    ]);
    return !!row; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
