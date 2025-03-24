import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { MedicationsProvider } from '../context/MedicationsContext';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MedicationsProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Medication Tracker',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="add-medication" 
            options={{ 
              title: 'Add Medication',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="medication-details" 
            options={{ 
              title: 'Medication Details',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="edit-medication" 
            options={{ 
              title: 'Edit Medication',
              presentation: 'modal'
            }} 
          />
        </Stack>
      </MedicationsProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
