import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

const dbDirPath = path.resolve(process.cwd(), "db"); // Path to the directory
const dbFilePath = path.join(dbDirPath, "mydb.sqlite"); // Path to the database file

// Ensure the directory exists
if (!fs.existsSync(dbDirPath)) {
  fs.mkdirSync(dbDirPath, { recursive: true });
}

const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log(`Database file connected at: ${dbFilePath}`);
  }
});

db.serialize(() => {
  // Enable foreign key enforcement
  db.run(`PRAGMA foreign_keys = ON;`, (err) => {
    if (err) console.error("Error enabling foreign key enforcement:", err);
  });

  // Step 1: Create a new table with the correct column name
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Nationality_New (
      NationalityID INTEGER PRIMARY KEY AUTOINCREMENT, -- Corrected column name
      NationalityName TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) console.error("Error creating new Nationality table:", err);
    }
  );

  // Step 2: Copy data from the old table to the new table
  db.run(
    `
    INSERT INTO Nationality_New (NationalityID, NationalityName)
    SELECT NationlityID, NationalityName FROM Nationality;
  `,
    (err) => {
      if (err)
        console.error("Error copying data to new Nationality table:", err);
    }
  );

  // Step 3: Drop the old table
  db.run(
    `
    DROP TABLE IF EXISTS Nationality;
  `,
    (err) => {
      if (err) console.error("Error dropping old Nationality table:", err);
    }
  );

  // Step 4: Rename the new table to the original name
  db.run(
    `
    ALTER TABLE Nationality_New RENAME TO Nationality;
  `,
    (err) => {
      if (err) console.error("Error renaming Nationality_New table:", err);
    }
  );

  // Step 5: Update BannedNationalites table to ensure foreign key references are correct
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedNationalites_New (
      BannedNationalityID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedNationalityDate DATE NOT NULL,
      NationalityID INTEGER NOT NULL, -- Updated foreign key reference
      AccountStationOptionID INTEGER NOT NULL,
      FOREIGN KEY (NationalityID) REFERENCES Nationality(NationalityID),
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID)
    )
  `,
    (err) => {
      if (err)
        console.error("Error creating new BannedNationalites table:", err);
    }
  );

  db.run(
    `
    INSERT INTO BannedNationalites_New (
      BannedNationalityID, BannedNationalityDate, NationalityID, AccountStationOptionID
    )
    SELECT
      BannedNationalityID, BannedNationalityDate, NationlityID, AccountStationOptionID
    FROM BannedNationalites;
  `,
    (err) => {
      if (err)
        console.error(
          "Error copying data to new BannedNationalites table:",
          err
        );
    }
  );

  db.run(
    `
    DROP TABLE IF EXISTS BannedNationalites;
  `,
    (err) => {
      if (err)
        console.error("Error dropping old BannedNationalites table:", err);
    }
  );

  db.run(
    `
    ALTER TABLE BannedNationalites_New RENAME TO BannedNationalites;
  `,
    (err) => {
      if (err)
        console.error("Error renaming BannedNationalites_New table:", err);
    }
  );

  console.log("Database schema updated successfully.");
});

db.close();
