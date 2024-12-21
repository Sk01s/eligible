import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db"; // Assumes `getDatabase` provides a MySQL connection
import { Country, CountryInput } from "./dbTypes";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// Function to insert a country
export async function insertCountryDataAccess({
  Code,
  CountryName,
  ContinentID,
}: CountryInput & { ContinentID: number }): Promise<{
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
      "INSERT INTO Countries (Code, CountryName, ContinentID) VALUES (?, ?, ?)",
      [Code, CountryName, ContinentID]
    );
    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
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
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    let insertedCount = 0;

    for (const { Code, CountryName, ContinentID } of countries) {
      const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO Countries (Code, CountryName, ContinentID) VALUES (?, ?, ?)",
        [Code, CountryName, ContinentID]
      );
      if (result.affectedRows > 0) {
        insertedCount++;
      }
    }

    return { success: true, insertedCount };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Function to update a country
export async function updateCountryDataAccess(
  countryID: number,
  code: string,
  countryName: string,
  continentID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE Countries SET Code = ?, CountryName = ?, ContinentID = ? WHERE CountryID = ?",
      [code, countryName, continentID, countryID]
    );
    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Function to delete a country
export async function deleteCountryDataAccess(
  countryID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM Countries WHERE CountryID = ?",
      [countryID]
    );
    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Function to fetch all countries
export async function getAllCountriesDataAccess(): Promise<Country[]> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM Countries");
    return rows as Country[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Function to delete all countries
export async function deleteAllCountriesDataAccess(): Promise<{
  success: boolean;
  error?: string;
}> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }
  try {
    const [result] = await db.execute<ResultSetHeader>("DELETE FROM Countries");
    return { success: result.affectedRows > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Function to find a country by ID
export async function findCountryDataAccess(
  countryID: number
): Promise<Country | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM Countries WHERE CountryID = ?",
      [countryID]
    );
    return rows.length > 0 ? (rows[0] as Country) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}

// Check if a country exists by its ID
export async function doesCountryExistDataAccess(
  countryID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM Countries WHERE CountryID = ?",
      [countryID]
    );
    return rows.length > 0; // Return true if the row exists, false otherwise
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
  }
}
