import { useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MOCK_USER, BACKGROUND_IMAGES } from '@/constants/MockData';
import { SPACING, TYPOGRAPHY } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function SignInScreen() {
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const { colors } = useTheme();

  const handleSignIn = () => {
    if (name === MOCK_USER.name && phone === MOCK_USER.phone) {
      router.push('/(auth)/user-type');
    }
  };

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGES.auth.signIn }}
      style={styles.container}
    >
      <ThemedView 
        style={[
          styles.overlay,
          { backgroundColor: colors.background.overlay }
        ]}
      >
        <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
          <MaterialCommunityIcons 
            name="sprout" 
            size={80} 
            color={colors.primary} 
          />
          <ThemedText 
            type="title" 
            style={[
              styles.title,
              { color: colors.text.inverse }
            ]}
          >
            Krishi Connect
          </ThemedText>
          <ThemedText 
            weight="medium"
            style={[
              styles.subtitle,
              { color: colors.text.inverse }
            ]}
          >
            Connecting Farmers and Workers
          </ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.form}>
          <Input
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            leftIcon="account"
            defaultValue={MOCK_USER.name}
          />
          
          <Input
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon="phone"
            defaultValue={MOCK_USER.phone}
          />
          
          <Button 
            title="Continue"
            onPress={handleSignIn}
            disabled={!name || !phone}
            style={styles.button}
          />

          <Button
            title="Continue with Google"
            variant="outline"
            leftIcon="google"
            onPress={handleSignIn}
            style={styles.button}
          />

          <ThemedView style={styles.demoHint}>
            <MaterialCommunityIcons 
              name="information" 
              size={16} 
              color={colors.info}
            />
            <ThemedText 
              style={[
                styles.demoText,
                { color: colors.info }
              ]}
            >
              Demo: Use name "user" and phone "123"
            </ThemedText>
          </ThemedView>
        </Animated.View>
      </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.md,
  },
  button: {
    marginTop: SPACING.sm,
  },
  demoHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  demoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
}); 