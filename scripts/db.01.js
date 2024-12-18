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

  // Create new BannedCountries table with foreign key constraints
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedCountries_New (
      BannedCountryID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedCountryDate DATE NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      CountryID INTEGER NOT NULL,
      AccountTypeID INTEGER NOT NULL,
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID),
      FOREIGN KEY (CountryID) REFERENCES Countries(CountryID),
      FOREIGN KEY (AccountTypeID) REFERENCES AccountTypes(AccountTypeID)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating BannedCountries_New table:", err);
      } else {
        console.log("BannedCountries_New table created.");
      }
    }
  );

  // Copy data from old BannedCountries table to new table
  db.run(
    `
    INSERT INTO BannedCountries_New (BannedCountryID, BannedCountryDate, AccountStationOptionID, CountryID, AccountTypeID)
    SELECT BannedCountryID, BannedCountryDate, AccountStationOptionID, CountryID, AccountTypeID
    FROM BannedCountries
  `,
    (err) => {
      if (err) {
        console.error("Error copying data to BannedCountries_New:", err);
      } else {
        console.log("Data copied to BannedCountries_New.");
      }
    }
  );

  // Drop old BannedCountries table
  db.run(`DROP TABLE BannedCountries`, (err) => {
    if (err) {
      console.error("Error dropping old BannedCountries table:", err);
    } else {
      console.log("Old BannedCountries table dropped.");
    }
  });

  // Rename new BannedCountries table to original name
  db.run(`ALTER TABLE BannedCountries_New RENAME TO BannedCountries`, (err) => {
    if (err) {
      console.error("Error renaming BannedCountries_New table:", err);
    } else {
      console.log("BannedCountries_New table renamed to BannedCountries.");
    }
  });

  // Repeat the same process for BannedNationalites
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedNationalites_New (
      BannedNationalityID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedNationalityDate DATE NOT NULL,
      NationlityID INTEGER NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      AccountTypeID INTEGER NOT NULL,
      FOREIGN KEY (NationlityID) REFERENCES Nationality(NationlityID),
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID),
      FOREIGN KEY (AccountTypeID) REFERENCES AccountTypes(AccountTypeID)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating BannedNationalites_New table:", err);
      } else {
        console.log("BannedNationalites_New table created.");
      }
    }
  );

  db.run(
    `
    INSERT INTO BannedNationalites_New (BannedNationalityID, BannedNationalityDate, NationlityID, AccountStationOptionID, AccountTypeID)
    SELECT BannedNationalityID, BannedNationalityDate, NationlityID, AccountStationOptionID, AccountTypeID
    FROM BannedNationalites
  `,
    (err) => {
      if (err) {
        console.error("Error copying data to BannedNationalites_New:", err);
      } else {
        console.log("Data copied to BannedNationalites_New.");
      }
    }
  );

  db.run(`DROP TABLE BannedNationalites`, (err) => {
    if (err) {
      console.error("Error dropping old BannedNationalites table:", err);
    } else {
      console.log("Old BannedNationalites table dropped.");
    }
  });

  db.run(
    `ALTER TABLE BannedNationalites_New RENAME TO BannedNationalites`,
    (err) => {
      if (err) {
        console.error("Error renaming BannedNationalites_New table:", err);
      } else {
        console.log(
          "BannedNationalites_New table renamed to BannedNationalites."
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
