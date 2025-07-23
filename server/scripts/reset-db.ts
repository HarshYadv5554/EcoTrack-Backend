import { query } from "../lib/database";

async function resetDatabase() {
  try {
    console.log("Resetting database schema...");

    // Drop existing tables if they exist
    await query(`DROP TABLE IF EXISTS waste_reports CASCADE`);
    await query(`DROP TABLE IF EXISTS users CASCADE`);

    console.log("Dropped existing tables");

    // Create users table with correct schema
    await query(`
      CREATE TABLE users (
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

    console.log("Created users table");

    // Create waste_reports table
    await query(`
      CREATE TABLE waste_reports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        address TEXT,
        waste_type VARCHAR(100) NOT NULL,
        severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
        description TEXT NOT NULL,
        images TEXT[],
        status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
        contact_name VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Created waste_reports table");

    // Create indexes
    await query(`CREATE INDEX idx_users_email ON users(email)`);
    await query(
      `CREATE INDEX idx_waste_reports_user_id ON waste_reports(user_id)`,
    );
    await query(
      `CREATE INDEX idx_waste_reports_status ON waste_reports(status)`,
    );
    await query(
      `CREATE INDEX idx_waste_reports_location ON waste_reports(latitude, longitude)`,
    );

    console.log("Created indexes");

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

    // Create triggers
    await query(`
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await query(`
      CREATE TRIGGER update_waste_reports_updated_at
        BEFORE UPDATE ON waste_reports
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log("Created triggers");
    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  }
}

export { resetDatabase };
