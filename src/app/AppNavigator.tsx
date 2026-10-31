import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSession } from '@/features/auth/AuthProvider';
import { HomeScreen } from '@/screens/HomeScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import type { RootStackParamList } from './navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}