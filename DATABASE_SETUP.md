# Database Setup Guide

This project uses **Neon** (serverless PostgreSQL) to store tree planting data.

## Prerequisites

1. Create a free Neon account at [https://console.neon.tech](https://console.neon.tech)
2. Create a new project in Neon
3. Copy your database connection string

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

The `@neondatabase/serverless` package is already included.

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Neon database connection string:

```
VITE_DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Important:** The `VITE_` prefix is required for Vite to expose the variable to the client.

### 3. Initialize Database Schema

Install `tsx` for running TypeScript scripts:

```bash
npm install -D tsx
```

Run the initialization script:

```bash
npx tsx scripts/init-db.ts
```

This will create the `trees` table with the following schema:

```sql
CREATE TABLE trees (
  id SERIAL PRIMARY KEY,
  x DECIMAL(10, 2) NOT NULL,
  y DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  color VARCHAR(7) DEFAULT '#16a34a',
  timestamp VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run the Application

```bash
npm run dev
```

## API Functions

The database integration provides the following functions:

### `getTrees()`
Fetch all trees from the database, ordered by creation date (newest first).

### `createTree(tree)`
Insert a new tree into the database.

### `deleteTree(id)`
Delete a tree by ID.

### `getTreeCount()`
Get the total number of trees planted.

## Service Layer

The `treeService` in `src/services/treeService.ts` provides a clean API:

```typescript
import { treeService } from './services/treeService';

// Fetch all trees
const trees = await treeService.fetchTrees();

// Add a new tree
const newTree = await treeService.addTree({
  x: 100,
  y: 200,
  name: 'John Doe',
  image: 'data:image/...',
  color: '#16a34a',
  timestamp: new Date().toISOString()
});

// Remove a tree
await treeService.removeTree(treeId);

// Get tree count
const count = await treeService.count();
```

## React Hook

The `useTreeStorage` hook automatically loads trees on mount and provides methods to add/remove trees:

```typescript
const { trees, isLoading, error, addTree, removeTree, refreshTrees } = useTreeStorage();
```

## Database Migration

If you need to update the schema in the future:

1. Connect to your Neon database using `psql` or the Neon SQL Editor
2. Run your migration SQL commands
3. Update the `initializeDatabase()` function in `src/lib/db.ts`

## Security Notes

- Never commit your `.env` file
- The database connection string contains credentials
- Consider using Neon's branching feature for development/production databases
- For production, use environment variables in your hosting platform (Netlify, Vercel, etc.)

## Troubleshooting

### Connection Issues

If you see "Failed to connect to database":

1. Check your connection string in `.env`
2. Ensure your IP is allowlisted in Neon (check "Settings" > "IP Allow")
3. Verify the database name and credentials are correct

### Schema Errors

If the table already exists, you can drop and recreate it:

```sql
DROP TABLE IF EXISTS trees;
```

Then run the init script again.

## Production Deployment

When deploying to production:

1. Add `VITE_DATABASE_URL` to your hosting platform's environment variables
2. Run the database initialization script once on your production database
3. Build and deploy your application

```bash
npm run build
```
