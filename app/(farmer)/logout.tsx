import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';

export default function LogoutScreen() {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        router.replace('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    // Add a small delay to show the logout message
    const timer = setTimeout(handleLogout, 1500);

    return () => clearTimeout(timer);
  }, [signOut]);

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        entering={FadeIn}
        style={styles.content}
      >
        <ThemedText style={styles.title}>Logging out...</ThemedText>
        <ThemedText style={styles.message}>
          Thank you for using Farbour. See you soon!
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.neutral[900],
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: BRAND_COLORS.neutral[400],
    textAlign: 'center',
  },
}); 