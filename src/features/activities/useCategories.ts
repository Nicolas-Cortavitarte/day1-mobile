import { useEffect, useState } from 'react';

import { api } from '@/lib/api';
import type { Category } from './types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then(setCategories)
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}