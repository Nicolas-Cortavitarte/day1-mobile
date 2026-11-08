import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';

import { AppNavigator } from '@/app/AppNavigator';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { PreferencesProvider } from '@/features/profile/PreferencesProvider';
import { ProfileProvider } from '@/features/profile/ProfileProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <PreferencesProvider>
          <ProfileProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ProfileProvider>
        </PreferencesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
