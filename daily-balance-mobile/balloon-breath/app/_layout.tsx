import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from './UserContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LandingPage" />
            <Stack.Screen name="Onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </UserProvider>
  );
}

