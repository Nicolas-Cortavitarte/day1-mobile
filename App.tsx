import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';

import { AppNavigator } from '@/app/AppNavigator';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { PreferencesProvider } from '@/features/profile/PreferencesProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <PreferencesProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PreferencesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;