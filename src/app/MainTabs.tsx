import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Day1Icon, type Day1IconName } from '@/components/atoms/Day1Icon';
import { useTheme } from '@/hooks/use-theme';
import { CalendarioScreen } from '@/screens/CalendarioScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { PerfilScreen } from '@/screens/PerfilScreen';
import { ProgresoScreen } from '@/screens/ProgresoScreen';
import type { MainTabParamList } from './navigation-types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, Day1IconName> = {
  Hoy: 'home',
  Calendario: 'calendarDays',
  Progreso: 'trendingUp',
  Perfil: 'user',
};

export function MainTabs() {
  const colors = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.actionPrimary,
        tabBarInactiveTintColor: colors.textSecondaryReadable,
        tabBarStyle: { backgroundColor: colors.surfaceCard, borderTopColor: colors.borderSubtle },
        tabBarLabelStyle: { fontWeight: '500', fontSize: 12 },
        tabBarIcon: ({ color, focused }) => (
          <Day1Icon name={TAB_ICONS[route.name]} size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
        ),
      })}>
      <Tab.Screen name="Hoy" component={HomeScreen} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
      <Tab.Screen name="Progreso" component={ProgresoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
