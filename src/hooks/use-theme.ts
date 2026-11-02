import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { usePreferencesContext } from '@/features/profile/PreferencesProvider';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { preferences } = usePreferencesContext();

  const resolved =
    preferences?.theme === 'LIGHT' ? 'light' :
    preferences?.theme === 'DARK' ? 'dark' :
    systemScheme === 'dark' ? 'dark' : 'light';

  return Colors[resolved];
}