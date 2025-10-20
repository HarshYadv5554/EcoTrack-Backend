import { query } from "../lib/database";

async function inspectDatabase() {
  try {
    console.log("Inspecting database schema...");

    // Check if users table exists and get its structure
    const usersTableInfo = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log("Users table columns:");
    console.log(usersTableInfo.rows);

    // Check if waste_reports table exists and get its structure
    const reportsTableInfo = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'waste_reports'
      ORDER BY ordinal_position;
    `);

    console.log("Waste reports table columns:");
    console.log(reportsTableInfo.rows);
  } catch (error) {
    console.error("Error inspecting database:", error);
  }
}

inspectDatabase();
