import { query } from "./database";

export async function initializeDatabase() {
  if (
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL ===
      "postgresql://username:password@hostname:port/database"
  ) {
    console.log(
      "Skipping database initialization - DATABASE_URL not configured",
    );
    return;
  }

  try {
    console.log("Initializing database schema...");

    // Check if users table already exists with wrong schema
    try {
      const checkTable = await query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password_hash'
      `);

      if (checkTable.rows.length === 0) {
        // Table exists but doesn't have password_hash column, need to reset
        console.log(
          "Existing table detected with incompatible schema, resetting...",
        );
        await query(`DROP TABLE IF EXISTS waste_reports CASCADE`);
        await query(`DROP TABLE IF EXISTS users CASCADE`);
        console.log("Dropped existing tables");
      }
    } catch (error) {
      // Table doesn't exist, continue with normal creation
    }

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        avatar_url VARCHAR(500),
        points INTEGER DEFAULT 0,
        joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create waste_reports table
    await query(`
      CREATE TABLE IF NOT EXISTS waste_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT,
        waste_type VARCHAR(100) NOT NULL,
        severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
        description TEXT NOT NULL,
        images TEXT[], -- Array of image URLs
        status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
        contact_name VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);

    // Create cleanup_activities table for the feed
    await query(`
      CREATE TABLE IF NOT EXISTS cleanup_activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        waste_report_id INTEGER REFERENCES waste_reports(id) ON DELETE CASCADE,
        waste_type VARCHAR(100) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT,
        description TEXT,
        before_image TEXT,
        after_image TEXT,
        verification_image TEXT NOT NULL, -- GPS verification photo
        verified BOOLEAN DEFAULT FALSE,
        points_earned INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        cleaned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_waste_reports_user_id ON waste_reports(user_id);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_waste_reports_status ON waste_reports(status);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_waste_reports_location ON waste_reports(latitude, longitude);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_cleanup_activities_user_id ON cleanup_activities(user_id);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_cleanup_activities_verified ON cleanup_activities(verified);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_cleanup_activities_cleaned_at ON cleanup_activities(cleaned_at DESC);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_cleanup_activities_location ON cleanup_activities(latitude, longitude);
    `);

    // Create updated_at trigger function
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at
    await query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_waste_reports_updated_at ON waste_reports;
      CREATE TRIGGER update_waste_reports_updated_at
        BEFORE UPDATE ON waste_reports
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      DROP TRIGGER IF EXISTS update_cleanup_activities_updated_at ON cleanup_activities;
      CREATE TRIGGER update_cleanup_activities_updated_at
        BEFORE UPDATE ON cleanup_activities
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("Database schema initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
