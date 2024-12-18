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

  // Step 1: Add the new AccountTypeID column with a foreign key constraint
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedContinents_New (
      BannedContinentID INTEGER PRIMARY KEY AUTOINCREMENT,
      ContinentID INTEGER NOT NULL,
      BannedContinentDate DATE NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      AccountTypeID INTEGER NULL,
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID),
      FOREIGN KEY (AccountTypeID) REFERENCES AccountType(AccountTypeID),
      FOREIGN KEY (ContinentID) REFERENCES Continents(ContinentID)
    )
  `,
    (err) => {
      if (err) {
        console.error(
          "Error creating BannedContinents_New table with AccountTypeID:",
          err
        );
      } else {
        console.log(
          "BannedContinents_New table created with AccountTypeID as a foreign key."
        );
      }
    }
  );

  // Step 2: Drop the old BannedContinents table
  db.run("DROP TABLE IF EXISTS BannedContinents", (err) => {
    if (err) {
      console.error("Error dropping old BannedContinents table:", err);
    } else {
      console.log("Old BannedContinents table dropped.");
    }
  });

  // Step 3: Rename the new table to BannedContinents
  db.run(
    "ALTER TABLE BannedContinents_New RENAME TO BannedContinents",
    (err) => {
      if (err) {
        console.error("Error renaming BannedContinents_New table:", err);
      } else {
        console.log("BannedContinents_New table renamed to BannedContinents.");
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
