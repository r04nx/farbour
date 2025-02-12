import { useState } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, View, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Database } from '@/types/supabase';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type UserType = Database['public']['Enums']['user_type'];

const FARMER_IMAGE = 'https://images.unsplash.com/photo-1595508064774-5ff825520bb6?q=80&w=2574&auto=format&fit=crop';
const LABORER_IMAGE = 'https://images.unsplash.com/photo-1593004571499-3c80616323ed?q=80&w=2574&auto=format&fit=crop';

const GRADIENT_OVERLAY = ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)'] as const;
const SELECTED_GRADIENT = ['rgba(52,211,153,0.8)', 'rgba(16,185,129,0.9)'] as const;

export default function UserTypeScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const { colors } = useTheme();
  const { updateProfile, user } = useAuth();

  const handleUserTypeSelect = async (type: UserType) => {
    if (!user) {
      setError('User not found. Please try signing in again.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateError } = await updateProfile({
      user_type: type,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push(`/(${type})/home`);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        I am a...
      </ThemedText>

      {/* Farmer Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          setSelectedType('farmer');
          handleUserTypeSelect('farmer');
        }}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: FARMER_IMAGE }}
          style={styles.optionBackground}
          imageStyle={styles.optionImage}
        >
          <LinearGradient
            colors={selectedType === 'farmer' ? SELECTED_GRADIENT : GRADIENT_OVERLAY}
            style={styles.optionOverlay}
          >
            <MaterialCommunityIcons
              name="tractor"
              size={48}
              color="#fff"
            />
            <ThemedText style={styles.optionTitle}>
              Farmer
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Post jobs and find skilled workers for your farm
            </ThemedText>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      {/* Laborer Option */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          setSelectedType('laborer');
          handleUserTypeSelect('laborer');
        }}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: LABORER_IMAGE }}
          style={styles.optionBackground}
          imageStyle={styles.optionImage}
        >
          <LinearGradient
            colors={selectedType === 'laborer' ? SELECTED_GRADIENT : GRADIENT_OVERLAY}
            style={styles.optionOverlay}
          >
            <MaterialCommunityIcons
              name="account-hard-hat"
              size={48}
              color="#fff"
            />
            <ThemedText style={styles.optionTitle}>
              Farm Worker
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Find work opportunities and connect with farmers
            </ThemedText>
          </LinearGradient>
        </ImageBackground>
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
          You can change your user type later in settings
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    color: BRAND_COLORS.neutral[800],
  },
  optionContainer: {
    height: SCREEN_HEIGHT * 0.32,
    marginBottom: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionBackground: {
    width: '100%',
    height: '100%',
  },
  optionImage: {
    borderRadius: 20,
  },
  optionOverlay: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  optionDescription: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
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
    flex: 1,
  },
}); 