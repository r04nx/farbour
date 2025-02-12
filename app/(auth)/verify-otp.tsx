import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function VerifyOTPScreen() {
  const { phone, name, isNewUser } = useLocalSearchParams<{ 
    phone: string;
    name: string;
    isNewUser: string;
  }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { verifyOTP } = useAuth();

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }

    if (!phone) {
      setError('Phone number not found. Please try signing in again.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: verifyError } = await verifyOTP(phone, otp);

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
    } else {
      if (isNewUser === 'true') {
        router.push('/(auth)/user-type');
      } else {
        router.push('/(farmer)/home');
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // Create an array of 6 digits from the OTP
  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] || '');

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.delay(200)} style={styles.content}>
        <MaterialCommunityIcons 
          name="message-badge-outline" 
          size={80} 
          color={colors.primary} 
        />

        <ThemedText type="title" style={styles.title}>
          {isNewUser === 'true' ? 'Create Your Account' : 'Welcome Back'}
        </ThemedText>

        <ThemedText style={styles.description}>
          {isNewUser === 'true' 
            ? `We've sent a verification code to ${phone} to create your account.`
            : `We've sent a verification code to ${phone} to sign you in.`
          }
        </ThemedText>

        <View style={styles.otpContainer}>
          <Input
            value={otp}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              if (numericText.length <= 6) {
                setOtp(numericText);
                setError(null);
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            autoFocus
          />
          <View style={styles.otpBoxesContainer}>
            {otpDigits.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                ]}
              >
                <ThemedText style={styles.otpDigit}>
                  {digit}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

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
          title="Verify"
          onPress={handleVerifyOTP}
          disabled={!otp || loading}
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
            Didn't receive the code? Make sure you entered the correct phone number and try again.
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    marginTop: SPACING.lg,
  },
  description: {
    fontSize: TYPOGRAPHY.sizes.md,
    textAlign: 'center',
    color: BRAND_COLORS.neutral[600],
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral[300],
    backgroundColor: BRAND_COLORS.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    backgroundColor: BRAND_COLORS.neutral[100],
    borderColor: BRAND_COLORS.primary[500],
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '600',
    color: BRAND_COLORS.neutral[900],
  },
  button: {
    width: '100%',
    marginTop: SPACING.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
    width: '100%',
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
    width: '100%',
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    flex: 1,
  },
}); 