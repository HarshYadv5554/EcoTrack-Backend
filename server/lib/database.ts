import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

let pool: Pool | null = null;

try {
  if (
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL !==
      "postgresql://username:password@hostname:port/database"
  ) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });

    // Test the connection
    pool.on("connect", () => {
      console.log("Connected to PostgreSQL database");
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
  } else {
    console.warn(
      "DATABASE_URL not configured. Database features will be disabled.",
    );
  }
} catch (error) {
  console.error("Failed to initialize database pool:", error);
}

export { pool };

// Helper function to execute queries
export const query = async (text: string, params?: any[]) => {
  if (!pool) {
    throw new Error("Database not connected. Please configure DATABASE_URL.");
  }

  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};
