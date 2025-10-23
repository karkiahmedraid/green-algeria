# Neon Database Integration - Quick Start

## ✅ What's Been Done

I've successfully integrated Neon database into your Algeria Tree Campaign project. Here's what was added:

### 📁 New Files Created

1. **`src/lib/db.ts`** - Core database functions using Neon
   - `getTrees()` - Fetch all trees
   - `createTree()` - Add new tree
   - `deleteTree()` - Remove tree
   - `getTreeCount()` - Get total count
   - `initializeDatabase()` - Create tables

2. **`src/services/treeService.ts`** - Service layer for clean API
   - Converts between database and app formats
   - Error handling wrapper

3. **`scripts/init-db.ts`** - Database initialization script

4. **`DATABASE_SETUP.md`** - Complete setup documentation

5. **`.env.example`** - Environment template

### 🔄 Updated Files

- **`src/hooks/useTreeStorage.ts`** - Now uses Neon instead of local storage
- **`src/layouts/Green-algeria-page.tsx`** - Uses async `addTree()` method
- **`package.json`** - Added `@neondatabase/serverless`

## 🚀 Setup Instructions

### 1. Get Neon Database URL

```bash
# Visit https://console.neon.tech
# Create a project
# Copy your connection string
```

### 2. Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and add:
VITE_DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
```

### 3. Install Dependencies

```bash
npm install
npm install -D tsx
```

### 4. Initialize Database

```bash
npm run db:init
```

Or manually:

```bash
npx tsx scripts/init-db.ts
```

### 5. Run Your App

```bash
npm run dev
```

## 📊 Database Schema

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

## 🔧 How It Works

### Before (Local Storage)
```typescript
// Trees stored in browser only
localStorage.setItem('trees', JSON.stringify(trees));
```

### After (Neon Database)
```typescript
// Trees stored in cloud database
await treeService.addTree({
  x: 100,
  y: 200,
  name: 'Ahmed',
  color: '#16a34a',
  timestamp: new Date().toISOString()
});
```

### Benefits
- ✅ **Persistent**: Data survives browser refresh
- ✅ **Shared**: All users see the same trees
- ✅ **Scalable**: Handles thousands of trees
- ✅ **Fast**: Serverless PostgreSQL with edge caching
- ✅ **Free**: Generous free tier from Neon

## 📝 API Usage Examples

### In Components

```typescript
import { useTreeStorage } from '../hooks/useTreeStorage';

function MyComponent() {
  const { trees, addTree, removeTree, refreshTrees } = useTreeStorage();
  
  // Add tree
  await addTree({
    x: 100, y: 200,
    name: 'User Name',
    color: '#ff0000',
    timestamp: new Date().toISOString()
  });
  
  // Remove tree
  await removeTree(treeId);
  
  // Refresh from database
  await refreshTrees();
}
```

### Direct Service Calls

```typescript
import { treeService } from '../services/treeService';

// Get all trees
const trees = await treeService.fetchTrees();

// Get count
const count = await treeService.count();
```

## 🔒 Security

- Connection string is in `.env` (not committed to git)
- Use `VITE_` prefix so Vite exposes it to client
- For production: Set env vars in Netlify/Vercel dashboard

## 🐛 Troubleshooting

### "Failed to connect"
- Check connection string in `.env`
- Ensure format: `postgresql://user:pass@host/db?sslmode=require`

### "Table does not exist"
- Run: `npm run db:init`

### "CORS errors"
- Neon works client-side (no CORS needed)

## 📚 Next Steps

1. **Deploy to Netlify/Vercel**
   - Add `VITE_DATABASE_URL` in dashboard
   - Build and deploy

2. **Add Features**
   - Tree editing
   - User authentication
   - Tree statistics
   - Export data

3. **Optimize**
   - Add pagination
   - Cache frequently accessed data
   - Index optimization

## 🎉 You're All Set!

Your app now stores trees in a real cloud database. Every tree planted is saved and visible to all users!
