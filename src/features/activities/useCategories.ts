import { useManageCategories } from './useManageCategories';

export function useCategories() {
  const { categories, isLoading, error, reload } = useManageCategories();
  return { categories, isLoading, error, reload };
}
