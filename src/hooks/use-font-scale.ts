import { usePreferencesContext } from '@/features/profile/PreferencesProvider';

const SCALE_MULTIPLIERS = { SMALL: 0.9, MEDIUM: 1, LARGE: 1.15 } as const;

export function useFontScale(): number {
  const { preferences } = usePreferencesContext();
  return SCALE_MULTIPLIERS[preferences?.fontScale ?? 'MEDIUM'];
}