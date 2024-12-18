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
    console.error("Error creating database:", err);
  } else {
    console.log(`Database file created/connected at: ${dbFilePath}`);
  }
});

// Schema initialization
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Countries (
      CountryID INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-increment primary key
      Code TEXT NOT NULL,
      CountryName TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Nationality (
      NationlityID INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-increment primary key
      NationalityName TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS AccountStationOptions (
      AccountStationOptionID INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-increment primary key
      AccountStationName TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS BannedCountries (
      BannedCountryID INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-increment primary key
      BannedCountryDate DATE NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      CountryID INTEGER NOT NULL,
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID),
      FOREIGN KEY (CountryID) REFERENCES Countries(CountryID)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS BannedNationalites (
      BannedNationalityID INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-increment primary key
      BannedNationalityDate DATE NOT NULL,
      NationlityID INTEGER NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      FOREIGN KEY (NationlityID) REFERENCES Nationality(NationlityID),
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID)
    )
  `);

  console.log("Database schema initialized.");
});

db.close();
