import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import {
  BannedContinent,
  BannedContinentInput,
  BannedContinentView,
} from "./dbTypes";

// Insert a banned continent
export async function insertBannedContinentDataAccess(
  input: BannedContinentInput
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      `INSERT INTO BannedContinents (BannedContinentDate, AccountStationOptionID, ContinentID, AccountTypeID) 
       VALUES (?, ?, ?, ?)`,
      [
        input.BannedContinentDate,
        input.AccountStationOptionID,
        input.ContinentID,
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

// Update a banned continent
export async function updateBannedContinentDataAccess(
  bannedContinentID: number,
  input: BannedContinentInput
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      `UPDATE BannedContinents 
         SET BannedContinentDate = ?, AccountStationOptionID = ?, ContinentID = ?, AccountTypeID = ? 
         WHERE BannedContinentID = ?`,
      [
        input.BannedContinentDate,
        input.AccountStationOptionID,
        input.ContinentID,
        input.AccountTypeID,
        bannedContinentID,
      ]
    );
    const changes = result.changes ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Get all banned continents
export async function getAllBannedContinentsDataAccess(): Promise<
  BannedContinent[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all("SELECT * FROM BannedContinents");
    return rows as BannedContinent[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View a single banned continent with joined fields
export async function viewBannedContinentDataAccess(
  bannedContinentID: number
): Promise<BannedContinentView | null> {
  const db = await getDatabase();
  try {
    const row = await db.get(
      `SELECT 
         bc.BannedContinentID,
         bc.BannedContinentDate,
         bc.AccountStationOptionID,
         aso.AccountStationOptionName,
         bc.ContinentID,
         c.ContinentName,
         bc.AccountTypeID,
         at.AccountTypeName
       FROM BannedContinents bc
       INNER JOIN AccountStationOptions aso ON bc.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN Continents c ON bc.ContinentID = c.ContinentID
       LEFT JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       WHERE bc.BannedContinentID = ?`,
      [bannedContinentID]
    );
    return row ? (row as BannedContinentView) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View all banned continents with joined fields
export async function viewAllBannedContinentsDataAccess(): Promise<
  BannedContinentView[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all(
      `SELECT 
         bc.BannedContinentID,
         bc.BannedContinentDate,
         bc.AccountStationOptionID,
         aso.AccountStationOptionName,
         bc.ContinentID,
         c.ContinentName,
         bc.AccountTypeID,
         at.AccountTypeName
       FROM BannedContinents bc
       INNER JOIN AccountStationOptions aso ON bc.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN Continents c ON bc.ContinentID = c.ContinentID
       LEFT JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID`
    );
    return rows as BannedContinentView[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete a banned continent
export async function deleteBannedContinentDataAccess(
  bannedContinentID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "DELETE FROM BannedContinents WHERE BannedContinentID = ?",
      [bannedContinentID]
    );
    const changes = result.changes ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a banned continent exists by its ID
export async function doesBannedContinentExistDataAccess(
  bannedContinentID: number
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const row = await db.get(
      "SELECT 1 FROM BannedContinents WHERE BannedContinentID = ?",
      [bannedContinentID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

type isContinentAccountBannedProps = {
  CountryName: string;
  AccountTypeName: string;
  AccountStationOptionID: number;
};

export async function isContinentAccountBanned({
  AccountTypeName,
  CountryName,
  AccountStationOptionID,
}: isContinentAccountBannedProps) {
  const db = await getDatabase();
  try {
    const row = await db.get(
      `SELECT 1 FROM BannedContinents bc
       INNER  JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       WHERE bc.ContinentID = (select ContinentID from Countries where CountryName = ?) and at.AccountTypeName = ?  and bc.AccountStationOptionID = ? `,
      [CountryName, AccountTypeName, AccountStationOptionID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
