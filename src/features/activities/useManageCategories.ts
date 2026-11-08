import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Category } from './types';

export function useManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCategories(await api.get<Category[]>('/categories'));
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudieron cargar las categorías.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createCategory(name: string, color: string) {
    const category = await api.post<Category>('/categories', { name: name.trim(), color });
    setCategories((prev) => [...prev, category]);
    return category;
  }

  async function updateCategory(id: number, changes: { name?: string; color?: string }) {
    const updated = await api.patch<Category>(`/categories/${id}`, {
      ...changes,
      ...(changes.name !== undefined ? { name: changes.name.trim() } : {}),
    });
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function deleteCategory(id: number) {
    await api.delete(`/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return { categories, isLoading, error, reload: load, createCategory, updateCategory, deleteCategory };
}
