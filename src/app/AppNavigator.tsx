import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useSession } from '@/features/auth/AuthProvider';
import { CreateActivityScreen } from '@/screens/CreateActivityScreen';
import { ForgotPasswordScreen } from '@/screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/screens/ResetPasswordScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { ActivityDetailScreen } from '@/screens/ActivityDetailScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { session, isLoading, isPasswordRecovery } = useSession();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isPasswordRecovery ? (
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      ) : session ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="CreateActivity" component={CreateActivityScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="ActivityDetail" component={ActivityDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}