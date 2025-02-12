import { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions, TouchableOpacity, RefreshControl, Platform, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Farm background image from Unsplash - darker, more professional image
const BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&fit=crop';

const OVERLAY_COLORS = ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)'] as const;

type QuickAction = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  gradient: [string, string];
};

export default function FarmerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const { profile } = useAuth();

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const quickActions: QuickAction[] = [
    {
      icon: 'plus-circle',
      label: 'Post Job',
      onPress: () => router.push('/post-job' as any),
      gradient: [BRAND_COLORS.primary[700], BRAND_COLORS.primary[900]],
    },
    {
      icon: 'account-group',
      label: 'My Workers',
      onPress: () => router.push('/workers' as any),
      gradient: [BRAND_COLORS.accent[700], BRAND_COLORS.accent[900]],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Section */}
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        style={styles.header}
      >
        <LinearGradient
          colors={OVERLAY_COLORS}
          style={styles.headerOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedText style={styles.greeting}>
            Welcome back,
          </ThemedText>
          <ThemedText style={styles.name}>
            {profile?.name || 'Farmer'}
          </ThemedText>

          {/* Stats Row */}
          <ThemedView style={styles.statsRow}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>3</ThemedText>
              <ThemedText style={styles.statLabel}>Active Jobs</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Workers</ThemedText>
            </ThemedView>
          </ThemedView>
        </LinearGradient>
      </ImageBackground>

      {/* Quick Actions */}
      <ThemedView style={styles.actionsContainer}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={action.gradient}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons
                name={action.icon}
                size={32}
                color="#fff"
              />
              <ThemedText style={styles.actionLabel}>
                {action.label}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Recent Activity */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          Recent Activity
        </ThemedText>
        <ThemedView style={styles.activityCard}>
          <ThemedView style={styles.activityItem}>
            <MaterialCommunityIcons
              name="account-check"
              size={24}
              color={BRAND_COLORS.primary[400]}
            />
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>
                New Worker Available
              </ThemedText>
              <ThemedText style={styles.activityTime}>
                2h ago
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.activityItem}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color={BRAND_COLORS.accent[400]}
            />
            <ThemedView style={styles.activityContent}>
              <ThemedText style={styles.activityTitle}>
                Job Completed: Wheat Harvesting
              </ThemedText>
              <ThemedText style={styles.activityTime}>
                1d ago
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.neutral[900],
  },
  header: {
    height: 280,
  },
  headerOverlay: {
    flex: 1,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: '700',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: SPACING.lg,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    height: 100,
  },
  actionGradient: {
    flex: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.md,
  },
  activityCard: {
    backgroundColor: BRAND_COLORS.neutral[800],
    borderRadius: 16,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
    color: '#fff',
  },
  activityTime: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
}); 