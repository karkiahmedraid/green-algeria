import { neon } from '@neondatabase/serverless';

// Initialize Neon client with connection string from environment
const sql = neon(import.meta.env.VITE_DATABASE_URL || '');

export interface DbTree {
  id: number;
  x: number;
  y: number;
  name: string;
  image?: string | null;
  color?: string;
  timestamp: string;
  created_at?: string;
}

/**
 * Fetch all trees from the database (without images for performance)
 */
export async function getTrees(): Promise<DbTree[]> {
  try {
    const trees = await sql`
      SELECT 
        id, 
        x, 
        y, 
        name, 
        color, 
        timestamp,
        created_at
      FROM trees 
      ORDER BY created_at DESC
    `;
    return trees as DbTree[];
  } catch (error) {
    console.error('Error fetching trees:', error);
    throw new Error('Failed to fetch trees from database');
  }
}

/**
 * Fetch a single tree by ID with its image
 */
export async function getTreeById(id: number): Promise<DbTree | null> {
  try {
    const [tree] = await sql`
      SELECT 
        id, 
        x, 
        y, 
        name, 
        image, 
        color, 
        timestamp,
        created_at
      FROM trees 
      WHERE id = ${id}
    `;
    return tree ? (tree as DbTree) : null;
  } catch (error) {
    console.error('Error fetching tree:', error);
    throw new Error('Failed to fetch tree from database');
  }
}

/**
 * Insert a new tree into the database
 */
export async function createTree(tree: Omit<DbTree, 'id' | 'created_at'>): Promise<DbTree> {
  try {
    const [newTree] = await sql`
      INSERT INTO trees (x, y, name, image, color, timestamp)
      VALUES (
        ${tree.x}, 
        ${tree.y}, 
        ${tree.name}, 
        ${tree.image || null}, 
        ${tree.color || '#16a34a'},
        ${tree.timestamp}
      )
      RETURNING *
    `;
    return newTree as DbTree;
  } catch (error) {
    console.error('Error creating tree:', error);
    throw new Error('Failed to create tree in database');
  }
}

/**
 * Delete a tree by ID
 */
export async function deleteTree(id: number): Promise<void> {
  try {
    await sql`DELETE FROM trees WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting tree:', error);
    throw new Error('Failed to delete tree from database');
  }
}

/**
 * Get tree count
 */
export async function getTreeCount(): Promise<number> {
  try {
    const [result] = await sql`SELECT COUNT(*) as count FROM trees`;
    return Number((result as any).count);
  } catch (error) {
    console.error('Error counting trees:', error);
    return 0;
  }
}

/**
 * Initialize database schema (run once)
 */
export async function initializeDatabase(): Promise<void> {
  try {
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
    
    // Create index on created_at for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_trees_created_at 
      ON trees(created_at DESC)
    `;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw new Error('Failed to initialize database');
  }
}
