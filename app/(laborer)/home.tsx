import { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GuideCharacter } from '@/components/GuideCharacter';
import { colors, shadows, SPACING } from '@/constants/Theme';

// Updated mock data with more descriptive stats
const MOCK_STATS = [
  {
    id: '1',
    title: 'Active Applications',
    value: '3',
    icon: 'clipboard-check',
    color: colors.primary,
  },
  {
    id: '2',
    title: 'Total Earnings',
    value: '₹15,000',
    icon: 'currency-inr',
    color: colors.success,
  },
  {
    id: '3',
    title: 'Completed Jobs',
    value: '12',
    icon: 'briefcase-check',
    color: colors.info,
  },
  {
    id: '4',
    title: 'Rating',
    value: '4.5',
    icon: 'star',
    color: colors.warning,
  },
];

const MOCK_UPCOMING_JOBS = [
  {
    id: '1',
    title: 'Rice Field Work',
    date: 'Tomorrow',
    time: '8:00 AM',
    location: 'Bangalore Rural',
    wage: '₹500/day',
  },
  {
    id: '2',
    title: 'Harvest Support',
    date: 'Next Week',
    time: '7:00 AM',
    location: 'Mysore',
    wage: '₹450/day',
  },
];

const GUIDE_MESSAGES = [
  {
    id: '1',
    message: "Welcome to Krishi Connect! I'm Kisan, your guide. Let me show you around!",
  },
  {
    id: '2',
    message: "Here you can see your stats and upcoming jobs. Let's find some work for you!",
    action: () => router.push('/(laborer)/jobs'),
    actionLabel: 'Find Jobs',
  },
  {
    id: '3',
    message: "Don't forget to complete your profile to get better job matches.",
    action: () => router.push('/(laborer)/profile'),
    actionLabel: 'Update Profile',
  },
];

export default function LaborerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch updated data
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Welcome Back!</ThemedText>
        <Button
          title="Find Jobs"
          onPress={() => router.push('/(laborer)/jobs')}
          leftIcon="briefcase-search"
          style={styles.findButton}
        />
      </ThemedView>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <ThemedView style={styles.statsGrid}>
          {MOCK_STATS.map((stat, index) => (
            <Animated.View 
              key={stat.id}
              entering={FadeInDown.delay(index * 100)}
              style={styles.statCardContainer}
            >
              <ThemedView style={[styles.statCard, { backgroundColor: stat.color }]}>
                <MaterialCommunityIcons 
                  name={stat.icon} 
                  size={24} 
                  color={colors.text.inverse} 
                />
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statLabel}>{stat.title}</ThemedText>
              </ThemedView>
            </Animated.View>
          ))}
        </ThemedView>

        {/* Upcoming Jobs */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Upcoming Jobs
          </ThemedText>
          {MOCK_UPCOMING_JOBS.map((job) => (
            <ThemedView key={job.id} style={styles.jobCard}>
              <ThemedView style={styles.jobHeader}>
                <ThemedText type="subtitle" style={styles.jobTitle}>
                  {job.title}
                </ThemedText>
                <ThemedText style={styles.wage}>{job.wage}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.jobDetails}>
                <ThemedView style={styles.detailItem}>
                  <MaterialCommunityIcons 
                    name="calendar" 
                    size={16} 
                    color={colors.text.secondary} 
                  />
                  <ThemedText style={styles.detailText}>
                    {job.date} at {job.time}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.detailItem}>
                  <MaterialCommunityIcons 
                    name="map-marker" 
                    size={16} 
                    color={colors.text.secondary} 
                  />
                  <ThemedText style={styles.detailText}>
                    {job.location}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>

      {showGuide && (
        <GuideCharacter
          message="Welcome! I'm here to help you find the perfect job. Let's get started!"
          icon="robot-happy"
          onDismiss={() => setShowGuide(false)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  findButton: {
    height: 40,
  },
  scrollContent: {
    padding: SPACING.md,
    gap: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    padding: SPACING.xs,
  },
  statCardContainer: {
    width: `${50 - (SPACING.md / 2)}%`,
  },
  statCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginVertical: SPACING.xs,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.inverse,
    textAlign: 'center',
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    marginBottom: SPACING.xs,
  },
  jobCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: SPACING.md,
    ...shadows.sm,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  jobTitle: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  wage: {
    color: colors.primary,
    fontWeight: '600',
  },
  jobDetails: {
    gap: SPACING.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 