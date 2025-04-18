import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { MedicationsProvider } from '../context/MedicationsContext';
import { AuthProvider } from '../context/AuthContext';
import { requestLocalNotificationsPermission } from '../services/notifications';
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
      // Request notification permissions when app loads
      requestLocalNotificationsPermission().catch(error => 
        console.error('Error requesting notification permissions:', error)
      );
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <MedicationsProvider>
          <Stack>
            <Stack.Screen 
              name="login" 
              options={{ 
                title: 'Sign In',
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="register" 
              options={{ 
                title: 'Create Account',
                headerShown: false
              }} 
            />
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
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
