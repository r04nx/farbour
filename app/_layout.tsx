import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after resources are loaded
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Handle any errors
        console.warn('Error hiding splash screen:', e);
      }
    };

    hideSplash();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}
