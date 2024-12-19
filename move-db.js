import { existsSync, copyFileSync } from "fs";
import { join } from "path";

// Source and target paths
const source = join("/app/db", "mydb.sqlite");
const target = join("/db", "mydb.sqlite");

// Check if source file exists
if (existsSync(source)) {
  try {
    // Copy the file
    copyFileSync(source, target);
    console.log(`Successfully copied database to ${target}`);
  } catch (error) {
    console.error("Error copying file:", error.message);
  }
} else {
  console.error(`Source file not found at ${source}`);
}
