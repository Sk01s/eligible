import { handleDBError } from "../lib/utils";
import { getDatabase } from "./db";
import {
  BannedContinent,
  BannedContinentInput,
  BannedContinentView,
} from "./dbTypes";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Insert a banned continent
export async function insertBannedContinentDataAccess(
  input: BannedContinentInput
): Promise<{ success: boolean; lastID?: number; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO BannedContinents (BannedContinentDate, AccountStationOptionID, ContinentID, AccountTypeID) 
       VALUES (?, ?, ?, ?)`,
      [
        input.BannedContinentDate,
        input.AccountStationOptionID,
        input.ContinentID,
        input.AccountTypeID,
      ]
    );
    return { success: true, lastID: result.insertId };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Update a banned continent
export async function updateBannedContinentDataAccess(
  bannedContinentID: number,
  input: BannedContinentInput
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
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
    const changes = result.affectedRows ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Get all banned continents
export async function getAllBannedContinentsDataAccess(): Promise<
  BannedContinent[]
> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM BannedContinents"
    );
    return rows as BannedContinent[];
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// View a single banned continent with joined fields
export async function viewBannedContinentDataAccess(
  bannedContinentID: number
): Promise<BannedContinentView | null> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
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
    return rows.length > 0 ? (rows[0] as BannedContinentView) : null;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// View all banned continents with joined fields
export async function viewAllBannedContinentsDataAccess(): Promise<
  BannedContinentView[]
> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
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
  }
}

// Delete a banned continent
export async function deleteBannedContinentDataAccess(
  bannedContinentID: number
): Promise<{ success: boolean; error?: string }> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM BannedContinents WHERE BannedContinentID = ?",
      [bannedContinentID]
    );
    const changes = result.affectedRows ?? 0;
    return { success: changes > 0 };
  } catch (error: unknown) {
    return handleDBError(error);
  }
}

// Check if a banned continent exists by its ID
export async function doesBannedContinentExistDataAccess(
  bannedContinentID: number
): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT 1 FROM BannedContinents WHERE BannedContinentID = ?",
      [bannedContinentID]
    );
    return rows.length > 0;
  } catch (error: unknown) {
    return handleDBError(error);
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
}: isContinentAccountBannedProps): Promise<boolean> {
  const db = await getDatabase();
  if (!db) {
    throw new Error("DB is not defined");
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1 FROM BannedContinents bc
       INNER JOIN AccountTypes at ON bc.AccountTypeID = at.AccountTypeID
       WHERE bc.ContinentID = (SELECT ContinentID FROM Countries WHERE CountryName = ?) 
         AND at.AccountTypeName = ? 
         AND bc.AccountStationOptionID = ?`,
      [CountryName, AccountTypeName, AccountStationOptionID]
    );
    return rows.length > 0;
  } catch (error: unknown) {
    return handleDBError(error);
  }
}
