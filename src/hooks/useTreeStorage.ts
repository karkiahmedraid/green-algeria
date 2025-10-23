import { useState, useEffect } from 'react';
import type { Tree } from '../types/tree.types';

/**
 * Custom hook to manage tree data persistence using browser storage
 */
export const useTreeStorage = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load trees from storage on mount
  useEffect(() => {
    const loadTrees = async () => {
      try {
        const result = await (window as any).storage.get('algeria-trees-data', true);
        if (result && result.value) {
          setTrees(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No existing trees data');
      } finally {
        setIsLoading(false);
      }
    };
    loadTrees();
  }, []);

  // Save trees to storage whenever they change
  useEffect(() => {
    if (!isLoading && trees.length > 0) {
      const saveTrees = async () => {
        try {
          await (window as any).storage.set('algeria-trees-data', JSON.stringify(trees), true);
        } catch (error) {
          console.error('Failed to save trees:', error);
        }
      };
      saveTrees();
    }
  }, [trees, isLoading]);

  return { trees, setTrees, isLoading };
};
