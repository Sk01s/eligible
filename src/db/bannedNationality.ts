import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import {
  BannedNationality,
  BannedNationalityInput,
  BannedNationalityView,
} from "./dbTypes";

// Insert a banned nationality
export async function insertBannedNationalityDataAccess(
  input: BannedNationalityInput
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      `INSERT INTO BannedNationalites (BannedNationalityDate, NationalityID, AccountStationOptionID, AccountTypeID) 
       VALUES (?, ?, ?, ?)`,
      [
        input.BannedNationalityDate,
        input.NationalityID,
        input.AccountStationOptionID,
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

// Update a banned nationality
export async function updateBannedNationalityDataAccess(
  bannedNationalityID: number,
  input: BannedNationalityInput
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      `UPDATE BannedNationalites 
         SET BannedNationalityDate = ?, NationalityID = ?, AccountStationOptionID = ?, AccountTypeID = ? 
         WHERE BannedNationalityID = ?`,
      [
        input.BannedNationalityDate,
        input.NationalityID,
        input.AccountStationOptionID,
        input.AccountTypeID,
        bannedNationalityID,
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

// Get all banned nationalities
export async function getAllBannedNationalitiesDataAccess(): Promise<
  BannedNationality[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all("SELECT * FROM BannedNationalites");
    return rows as BannedNationality[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View a single banned nationality with joined fields
export async function viewBannedNationalityDataAccess(
  bannedNationalityID: number
): Promise<BannedNationalityView | null> {
  const db = await getDatabase();
  try {
    const row = await db.get(
      `SELECT 
         bn.BannedNationalityID,
         bn.BannedNationalityDate,
         bn.NationalityID,
         n.NationalityName,
         bn.AccountStationOptionID,
         aso.AccountStationOptionName,
         bn.AccountTypeID,
         at.AccountTypeName
       FROM BannedNationalites bn
       INNER JOIN Nationality n ON bn.NationalityID = n.NationalityID
       INNER JOIN AccountStationOptions aso ON bn.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN AccountTypes at ON bn.AccountTypeID = at.AccountTypeID
       WHERE bn.BannedNationalityID = ?`,
      [bannedNationalityID]
    );
    return row ? (row as BannedNationalityView) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// View all banned nationalities with joined fields
export async function viewAllBannedNationalitiesDataAccess(): Promise<
  BannedNationalityView[]
> {
  const db = await getDatabase();
  try {
    const rows = await db.all(
      `SELECT 
         bn.BannedNationalityID,
         bn.BannedNationalityDate,
         bn.NationalityID,
         n.NationalityName,
         bn.AccountStationOptionID,
         aso.AccountStationOptionName,
         bn.AccountTypeID,
         at.AccountTypeName
       FROM BannedNationalites bn
       INNER JOIN Nationality n ON bn.NationalityID = n.NationalityID
       INNER JOIN AccountStationOptions aso ON bn.AccountStationOptionID = aso.AccountStationOptionID
       INNER JOIN AccountTypes at ON bn.AccountTypeID = at.AccountTypeID`
    );
    return rows as BannedNationalityView[];
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Delete a banned nationality
export async function deleteBannedNationalityDataAccess(
  bannedNationalityID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  try {
    const result = await db.run(
      "DELETE FROM BannedNationalites WHERE BannedNationalityID = ?",
      [bannedNationalityID]
    );
    const changes = result.changes ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}

// Check if a banned nationality exists by its ID
export async function doesBannedNationalityExistDataAccess(
  bannedNationalityID: number
): Promise<boolean> {
  const db = await getDatabase();
  try {
    const row = await db.get(
      "SELECT 1 FROM BannedNationalites WHERE BannedNationalityID = ?",
      [bannedNationalityID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
type isNationalityAccountBannedProps = {
  NationalityName: string;
  AccountTypeName: string;
  AccountStationOptionID: number;
};

export async function isNationalityAccountBanned({
  AccountTypeName,
  NationalityName,
  AccountStationOptionID,
}: isNationalityAccountBannedProps) {
  const db = await getDatabase();
  try {
    const row = await db.get(
      `SELECT 1 FROM BannedNationalites bc
       INNER  JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       INNER  JOIN Nationality nt ON bc.NationalityID = nt.NationalityID
       WHERE nt.NationalityName = ? and at.AccountTypeName = ?  and bc.AccountStationOptionID = ? `,
      [NationalityName, AccountTypeName, AccountStationOptionID]
    );
    return !!row;
  } catch (error: unknown) {
    return handleDBError(error);
  } finally {
    await db.close();
  }
}
