import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const Stack = createNativeStackNavigator();

function PlaceholderScreen() {
  const colors = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundDefault }]}>
      <Day1Text variant="heading28">Day1 🚀</Day1Text>
      <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable}>
        Navegación y tokens de tema funcionando.
      </Day1Text>
    </View>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[12] },
});