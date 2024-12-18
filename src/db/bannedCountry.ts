// DATA ACCESS LAYER FUNCTIONS
import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import {
  BannedCountryInput,
  BannedCountry,
  BannedCountryView,
} from "./dbTypes";

// Insert a banned country
export async function insertBannedCountryDataAccess(
  input: BannedCountryInput
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      `INSERT INTO BannedCountries (BannedCountryDate, AccountStationOptionID, CountryID, AccountTypeID) 
       VALUES (?, ?, ?, ?)`,
      [
        input.BannedCountryDate,
        input.AccountStationOptionID,
        input.CountryID,
        input.AccountTypeID,
      ]
    );
    return { success: true, lastID: result.lastID };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
export async function updateBannedCountryDataAccess(
  bannedCountryID: number,
  input: BannedCountryInput
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
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
    const changes = result.changes ?? 0; // If undefined, fallback to 0
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Get all banned countries
export async function getAllBannedCountriesDataAccess(): Promise<
  BannedCountry[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all("SELECT * FROM BannedCountries");
    return rows as BannedCountry[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View a single banned country with joined fields
export async function viewBannedCountryDataAccess(
  bannedCountryID: number
): Promise<BannedCountryView | null> {
  const db = await getDatabase();
  try {
    const row = await db.get(
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
    return row ? (row as BannedCountryView) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View all banned countries with joined fields
export async function viewAllBannedCountriesDataAccess(): Promise<
  BannedCountryView[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all(
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
  } finally {
    await db.close();
  }
}

// Delete a banned country
export async function deleteBannedCountryDataAccess(
  bannedCountryID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "DELETE FROM BannedCountries WHERE BannedCountryID = ?",
      [bannedCountryID]
    );
    const changes = result.changes ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a banned country exists by its ID
export async function doesBannedCountryExistDataAccess(
  bannedCountryID: number
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const row = await db.get(
      "SELECT 1 FROM BannedCountries WHERE BannedCountryID = ?",
      [bannedCountryID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
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
}: isCountryAccountBannedProps) {
  const db = await getDatabase();
  try {
    const row = await db.get(
      `SELECT 1 FROM BannedCountries bc
       INNER  JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       INNER JOIN Countries c ON  bc.CountryID = c.CountryID
       WHERE c.CountryName = ? and at.AccountTypeName = ?  and bc.AccountStationOptionID = ? `,
      [CountryName, AccountTypeName, AccountStationOptionID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
