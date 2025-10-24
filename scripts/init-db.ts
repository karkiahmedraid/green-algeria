import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env file
const envPath = resolve(process.cwd(), '.env');
try {
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      const value = values.join('=');
      if (key && value) {
        process.env[key] = value;
      }
    }
  });
} catch (err) {
  console.error('⚠️  Could not load .env file');
}

const connectionString = process.env.VITE_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: No database connection string found!');
  console.error('Please set VITE_DATABASE_URL in your .env file');
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log('🌱 Initializing Algeria Tree Campaign database...\n');
  
  try {
    // Create trees table
    await sql`
      CREATE TABLE IF NOT EXISTS trees (
        id SERIAL PRIMARY KEY,
        x DECIMAL(10, 2) NOT NULL,
        y DECIMAL(10, 2) NOT NULL,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        color VARCHAR(7) DEFAULT '#16a34a',
        timestamp VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_trees_created_at 
      ON trees(created_at DESC)
    `;

    console.log('✅ Database initialized successfully!');
    console.log('📊 Table "trees" created with indexes');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
