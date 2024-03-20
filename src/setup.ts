import { sql } from "./lib/postgres";

// Create a table to store short links
async function setup() {
  // Create a new table
  await sql`
    CREATE TABLE IF NOT EXISTS short_links (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE,
      original_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  
  // Close the connection to the database
  await sql.end();

  console.log('Setup complete')
}

setup()