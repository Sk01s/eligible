import sqlite3 from "sqlite3";
import path from "path";

const dbFilePath = path.join(process.cwd(), "db", "mydb.sqlite");

const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log(`Database file connected at: ${dbFilePath}`);
  }
});

db.serialize(() => {
  // Enable foreign key support
  db.run("PRAGMA foreign_keys = ON", (err) => {
    if (err) {
      console.error("Error enabling foreign keys:", err);
    } else {
      console.log("Foreign key enforcement enabled.");
    }
  });

  // Step 1: Create a new table with the corrected column name
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedNationalites_New (
      BannedNationalityID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedNationalityDate DATE NOT NULL,
      NationalityID INTEGER NOT NULL, -- Corrected column name
      AccountStationOptionID INTEGER NOT NULL,
      AccountTypeID INTEGER NOT NULL,
      FOREIGN KEY (NationalityID) REFERENCES Nationality(NationalityID),
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID),
      FOREIGN KEY (AccountTypeID) REFERENCES AccountTypes(AccountTypeID)
    )
  `,
    (err) => {
      if (err) {
        console.error(
          "Error creating corrected BannedNationalites_New_ table:",
          err
        );
      } else {
        console.log(
          "New table BannedNationalites_New created with corrected column name."
        );
      }
    }
  );

  // Step 2: Copy data from the old table to the new table
  db.run(
    `
    INSERT INTO BannedNationalites_New (
      BannedNationalityID,
      BannedNationalityDate,
      NationalityID, -- Corrected column name
      AccountStationOptionID,
      AccountTypeID
    )
    SELECT
      BannedNationalityID,
      BannedNationalityDate,
      NationlityID, -- Misspelled column name from old table
      AccountStationOptionID,
      AccountTypeID
    FROM BannedNationalites
  `,
    (err) => {
      if (err) {
        console.error(
          "Error copying data to BannedNationalites_New_Corrected:",
          err
        );
      } else {
        console.log("Data copied to BannedNationalites_New_Corrected.");
      }
    }
  );

  // Step 3: Drop the old table
  db.run("DROP TABLE IF EXISTS BannedNationalites", (err) => {
    if (err) {
      console.error("Error dropping old BannedNationalites_New table:", err);
    } else {
      console.log("Old BannedNationalites_New table dropped.");
    }
  });

  // Step 4: Rename the new table to the old table's name
  db.run(
    "ALTER TABLE BannedNationalites_New RENAME TO BannedNationalites",
    (err) => {
      if (err) {
        console.error(
          "Error renaming BannedNationalites_New_Corrected table:",
          err
        );
      } else {
        console.log(
          "BannedNationalites_New_Corrected table renamed to BannedNationalites_New."
        );
      }
    }
  );
});

db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err);
  } else {
    console.log("Database connection closed.");
  }
});
