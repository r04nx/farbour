import { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

const COUNTRY_CODE = '+91';
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2574&auto=format&fit=crop';

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

    const { error: signInError, isNewUser } = await signIn(fullPhoneNumber, name);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { 
          phone: fullPhoneNumber, 
          name,
          isNewUser: isNewUser ? 'true' : 'false'
        }
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <Animated.View entering={FadeInUp.delay(200)} style={styles.header}>
            <MaterialCommunityIcons 
              name="sprout" 
              size={80} 
              color={BRAND_COLORS.primary[400]} 
            />
            <ThemedText type="title" style={styles.title}>
              Welcome to Farbour
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Connect with farmers and workers in your area
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
              style={styles.input}
            />
            
            <View style={styles.phoneInputContainer}>
              <ThemedView style={styles.countryCode}>
                <ThemedText style={styles.countryCodeText}>
                  {COUNTRY_CODE}
                </ThemedText>
              </ThemedView>
              <Input
                placeholder="Enter mobile number"
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
            
            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={rememberMe ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={rememberMe ? BRAND_COLORS.primary[400] : colors.text.secondary}
              />
              <ThemedText style={styles.rememberMeText}>
                Remember me
              </ThemedText>
            </TouchableOpacity>
            
            {error && (
              <Animated.View 
                entering={FadeIn}
                style={styles.errorContainer}
              >
                <MaterialCommunityIcons 
                  name="alert-circle" 
                  size={20} 
                  color={BRAND_COLORS.accent[500]} 
                />
                <ThemedText style={styles.errorText}>
                  {error}
                </ThemedText>
              </Animated.View>
            )}

            <Button 
              title="Continue"
              onPress={handleSignIn}
              disabled={!name || !phone || loading}
              style={styles.button}
              leftIcon="arrow-right"
            />

            <ThemedView style={styles.infoContainer}>
              <MaterialCommunityIcons 
                name="shield-check" 
                size={16} 
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.infoText}>
                Your information is secure with us
              </ThemedText>
            </ThemedView>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    gap: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  form: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: 50,
  },
  countryCode: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: SPACING.md,
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    width: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countryCodeText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
    color: '#fff',
  },
  phoneInput: {
    flex: 1,
    width:290,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rememberMeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.2)',
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.accent[500],
    flex: 1,
  },
  button: {
    height: 50,
    backgroundColor: BRAND_COLORS.primary[500],
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 