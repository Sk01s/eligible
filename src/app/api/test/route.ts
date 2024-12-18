import { getDatabase } from "@/db/db";

export async function GET() {
  try {
    const db = await getDatabase();

    // Example query to fetch data from the Countries table
    const countries = await db.all("SELECT * FROM Countries");

    return new Response(JSON.stringify(countries), { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Failed to access the database.", { status: 500 });
  }
}
