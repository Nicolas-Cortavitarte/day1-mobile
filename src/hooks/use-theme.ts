import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { preferences, cachedTheme } = usePreferencesContext();
  const theme = preferences?.theme ?? cachedTheme;

  const resolved =
    theme === 'LIGHT' ? 'light' :
    theme === 'DARK' ? 'dark' :
    systemScheme === 'dark' ? 'dark' : 'light';

  return Colors[resolved];
}