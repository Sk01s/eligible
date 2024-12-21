import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import {
  BannedCountryInput,
  BannedCountry,
  BannedCountryView,
} from "./dbTypes";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Insert a banned country
export async function insertBannedCountryDataAccess(
  input: BannedCountryInput
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO BannedCountries (BannedCountryDate, AccountStationOptionID, CountryID, AccountTypeID) 
       VALUES (?, ?, ?, ?)`,
      [
        input.BannedCountryDate,
        input.AccountStationOptionID,
        input.CountryID,
        input.AccountTypeID,
      ]
    );
    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Update a banned country
export async function updateBannedCountryDataAccess(
  bannedCountryID: number,
  input: BannedCountryInput
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE BannedCountries 
         SET BannedCountryDate = ?, AccountStationOptionID = ?, CountryID = ?, AccountTypeID = ? 
         WHERE BannedCountryID = ?`,
      [
        input.BannedCountryDate,
        input.AccountStationOptionID,
        input.CountryID,
        input.AccountTypeID,
        bannedCountryID,
      ]
    );
    const changes = result.affectedRows ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Get all banned countries
export async function getAllBannedCountriesDataAccess(): Promise<
  BannedCountry[]
> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM BannedCountries"
    );
    return rows as BannedCountry[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// View a single banned country with joined fields
export async function viewBannedCountryDataAccess(
  bannedCountryID: number
): Promise<BannedCountryView | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
         bc.BannedCountryID,
         bc.BannedCountryDate,
         bc.AccountStationOptionID,
         aso.AccountStationOptionName,
         bc.CountryID,
         c.CountryName,
         bc.AccountTypeID,
         at.AccountTypeName
       FROM BannedCountries bc
       INNER JOIN AccountStationOptions aso ON bc.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN Countries c ON bc.CountryID = c.CountryID
       INNER JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       WHERE bc.BannedCountryID = ?`,
      [bannedCountryID]
    );
    return rows.length > 0 ? (rows[0] as BannedCountryView) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// View all banned countries with joined fields
export async function viewAllBannedCountriesDataAccess(): Promise<
  BannedCountryView[]
> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
         bc.BannedCountryID,
         bc.BannedCountryDate,
         bc.AccountStationOptionID,
         aso.AccountStationOptionName,
         bc.CountryID,
         c.CountryName,
         bc.AccountTypeID,
         at.AccountTypeName
       FROM BannedCountries bc
       INNER JOIN AccountStationOptions aso ON bc.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN Countries c ON bc.CountryID = c.CountryID
       INNER JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID`
    );
    return rows as BannedCountryView[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Delete a banned country
export async function deleteBannedCountryDataAccess(
  bannedCountryID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM BannedCountries WHERE BannedCountryID = ?",
      [bannedCountryID]
    );
    const changes = result.affectedRows ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if a banned country exists by its ID
export async function doesBannedCountryExistDataAccess(
  bannedCountryID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM BannedCountries WHERE BannedCountryID = ?",
      [bannedCountryID]
    );
    return rows.length > 0;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

type isCountryAccountBannedProps = {
  CountryName: string;
  AccountTypeName: string;
  AccountStationOptionID: number;
};

export async function isCountryAccountBanned({
  AccountTypeName,
  CountryName,
  AccountStationOptionID,
}: isCountryAccountBannedProps): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1 FROM BannedCountries bc
       INNER JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       INNER JOIN Countries c ON bc.CountryID = c.CountryID
       WHERE c.CountryName = ? and at.AccountTypeName = ? and bc.AccountStationOptionID = ?`,
      [CountryName, AccountTypeName, AccountStationOptionID]
    );
    return rows.length > 0;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
