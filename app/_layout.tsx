import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

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

    // Listen for deep link
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      if (url && url.startsWith('farbour://auth-callback')) {
        // Parse tokens from URL fragment
        const parsed = Linking.parse(url);
        // Supabase returns tokens in the fragment, not query
        // e.g. farbour://auth-callback#access_token=...&refresh_token=...
        const hash = url.split('#')[1];
        if (hash) {
          const params = Object.fromEntries(new URLSearchParams(hash));
          if (params.access_token && params.refresh_token) {
            await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
          }
        }
      }
    };
    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
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
