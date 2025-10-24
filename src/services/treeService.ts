import { getTrees, createTree, deleteTree, getTreeCount, getTreeById, type DbTree } from '../lib/db';
import type { Tree } from '../types/tree.types';

/**
 * Convert database tree to app tree format
 */
function dbTreeToTree(dbTree: DbTree): Tree {
  return {
    id: dbTree.id,
    x: Number(dbTree.x),
    y: Number(dbTree.y),
    name: dbTree.name,
    image: dbTree.image ?? null,
    color: dbTree.color,
    timestamp: dbTree.timestamp,
  };
}

/**
 * Convert app tree to database tree format
 */
function treeToDbTree(tree: Omit<Tree, 'id'>): Omit<DbTree, 'id' | 'created_at'> {
  return {
    x: tree.x,
    y: tree.y,
    name: tree.name,
    image: tree.image,
    color: tree.color,
    timestamp: tree.timestamp,
  };
}

/**
 * Service layer for tree operations
 */
export const treeService = {
  /**
   * Fetch all trees
   */
  async fetchTrees(): Promise<Tree[]> {
    try {
      const dbTrees = await getTrees();
      return dbTrees.map(dbTreeToTree);
    } catch (error) {
      console.error('Tree service: Error fetching trees', error);
      throw error;
    }
  },

  /**
   * Add a new tree
   */
  async addTree(tree: Omit<Tree, 'id'>): Promise<Tree> {
    try {
      const dbTree = treeToDbTree(tree);
      const newDbTree = await createTree(dbTree);
      return dbTreeToTree(newDbTree);
    } catch (error) {
      console.error('Tree service: Error adding tree', error);
      throw error;
    }
  },

  /**
   * Remove a tree
   */
  async removeTree(id: number): Promise<void> {
    try {
      await deleteTree(id);
    } catch (error) {
      console.error('Tree service: Error removing tree', error);
      throw error;
    }
  },

  /**
   * Get total tree count
   */
  async count(): Promise<number> {
    try {
      return await getTreeCount();
    } catch (error) {
      console.error('Tree service: Error counting trees', error);
      return 0;
    }
  },

  /**
   * Fetch a single tree by ID with its image
   */
  async fetchTreeById(id: number): Promise<Tree | null> {
    try {
      const dbTree = await getTreeById(id);
      return dbTree ? dbTreeToTree(dbTree) : null;
    } catch (error) {
      console.error('Tree service: Error fetching tree by ID', error);
      throw error;
    }
  },
};
