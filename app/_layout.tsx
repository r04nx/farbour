import { DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { colors } from '@/constants/Theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootLayoutNav() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return <LoadingScreen />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(farmer)" />
      <Stack.Screen name="(laborer)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </NavThemeProvider>
    </ThemeProvider>
  );
}
