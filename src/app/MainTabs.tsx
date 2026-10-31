import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@/hooks/use-theme';
import { CalendarioScreen } from '@/screens/CalendarioScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { PerfilScreen } from '@/screens/PerfilScreen';
import { ProgresoScreen } from '@/screens/ProgresoScreen';
import type { MainTabParamList } from './navigation-types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const colors = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.actionPrimary,
        tabBarInactiveTintColor: colors.textSecondaryReadable,
        tabBarStyle: { backgroundColor: colors.surfaceCard, borderTopColor: colors.borderSubtle },
      }}>
      <Tab.Screen name="Hoy" component={HomeScreen} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}