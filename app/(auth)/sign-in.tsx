import { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BACKGROUND_IMAGES } from '@/constants/MockData';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

const COUNTRY_CODE = '+91';

export default function SignInScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!name || !phone) {
      setError('Please fill in all fields');
      return;
    }

    // Basic phone number validation for Indian numbers (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    const fullPhoneNumber = COUNTRY_CODE + phone;

    // Save credentials if remember me is checked
    if (rememberMe) {
      await AsyncStorage.setItem('rememberedUser', JSON.stringify({ name, phone }));
    } else {
      await AsyncStorage.removeItem('rememberedUser');
    }

    const { error: signInError } = await signIn(fullPhoneNumber, name);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { phone: fullPhoneNumber }
      });
    }
  };

  // Load remembered credentials on mount
  useEffect(() => {
    const loadRememberedUser = async () => {
      try {
        const rememberedUser = await AsyncStorage.getItem('rememberedUser');
        if (rememberedUser) {
          const { name: savedName, phone: savedPhone } = JSON.parse(rememberedUser);
          setName(savedName);
          setPhone(savedPhone);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered user:', error);
      }
    };
    loadRememberedUser();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGES.auth.signIn }}
      style={styles.container}
    >
      <ThemedView 
        style={[
          styles.overlay,
          { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
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
            Farbour
          </ThemedText>
          <ThemedText 
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
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            leftIcon="account"
            autoCapitalize="words"
            autoComplete="name"
          />
          
          <View style={styles.phoneInputContainer}>
            <ThemedView style={styles.countryCode}>
              <ThemedText style={styles.countryCodeText}>
                {COUNTRY_CODE}
              </ThemedText>
            </ThemedView>
            <Input
              placeholder="Enter 10-digit mobile number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text.replace(/[^0-9]/g, ''));
                setError(null);
              }}
              keyboardType="number-pad"
              leftIcon="phone"
              autoComplete="tel"
              maxLength={10}
              style={styles.phoneInput}
            />
          </View>
          
          {/* Remember Me Option */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
              size={24}
              color={rememberMe ? colors.primary : colors.text.secondary}
            />
            <ThemedText style={styles.rememberMeText}>
              Remember me
            </ThemedText>
          </TouchableOpacity>
          
          {error && (
            <ThemedView style={styles.errorContainer}>
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={20} 
                color={colors.error} 
              />
              <ThemedText 
                style={[
                  styles.errorText,
                  { color: colors.error }
                ]}
              >
                {error}
              </ThemedText>
            </ThemedView>
          )}

          <Button 
            title="Continue"
            onPress={handleSignIn}
            disabled={!name || !phone || loading}
            style={styles.button}
          />

          <ThemedView style={styles.infoContainer}>
            <MaterialCommunityIcons 
              name="information" 
              size={16} 
              color={colors.info}
            />
            <ThemedText 
              style={[
                styles.infoText,
                { color: colors.info }
              ]}
            >
              You'll receive a verification code via SMS
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
    fontWeight: '700',
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: 50,
    width: '100%',
    paddingLeft: 10,
  },
  countryCode: {
    backgroundColor: BRAND_COLORS.neutral[100],
    paddingHorizontal: SPACING.md,
    height: '90%',
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    width: 70,
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
    color: BRAND_COLORS.neutral[700],
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    minWidth: 250,
  },
  button: {
    marginTop: SPACING.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  rememberMeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[600],
  },
}); 