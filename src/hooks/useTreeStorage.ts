import { useState, useEffect, useCallback } from 'react';
import type { Tree } from '../types/tree.types';
import { treeService } from '../services/treeService';

/**
 * Custom hook to manage tree data persistence using Neon database
 */
export const useTreeStorage = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load trees from database on mount
  useEffect(() => {
    const loadTrees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTrees = await treeService.fetchTrees();
        setTrees(fetchedTrees);
      } catch (err) {
        console.error('Failed to load trees from database:', err);
        setError('Failed to load trees from database');
        // Fallback to empty array on error
        setTrees([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrees();
  }, []);

  // Add a new tree to the database
  const addTree = useCallback(async (newTree: Omit<Tree, 'id'>) => {
    try {
      const createdTree = await treeService.addTree(newTree);
      setTrees(prev => [...prev, createdTree]);
      return createdTree;
    } catch (err) {
      console.error('Failed to add tree to database:', err);
      setError('Failed to add tree to database');
      throw err;
    }
  }, []);

  // Remove a tree from the database
  const removeTree = useCallback(async (id: number) => {
    try {
      await treeService.removeTree(id);
      setTrees(prev => prev.filter(tree => tree.id !== id));
    } catch (err) {
      console.error('Failed to remove tree from database:', err);
      setError('Failed to remove tree from database');
      throw err;
    }
  }, []);

  // Refresh trees from database
  const refreshTrees = useCallback(async () => {
    try {
      setError(null);
      const fetchedTrees = await treeService.fetchTrees();
      setTrees(fetchedTrees);
    } catch (err) {
      console.error('Failed to refresh trees:', err);
      setError('Failed to refresh trees');
    }
  }, []);

  return { 
    trees, 
    setTrees, 
    isLoading, 
    error,
    addTree,
    removeTree,
    refreshTrees
  };
};
