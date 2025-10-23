import { initializeDatabase } from './src/lib/db';

/**
 * Run this script once to initialize the database schema
 * Usage: node --loader ts-node/esm scripts/init-db.ts
 * Or add to package.json: "db:init": "tsx scripts/init-db.ts"
 */
async function main() {
  console.log('🌱 Initializing Algeria Tree Campaign database...\n');
  
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully!');
    console.log('📊 Table "trees" created with indexes');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

main();
