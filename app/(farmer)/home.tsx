import { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/JobCard';
import { colors, shadows, SPACING } from '@/constants/Theme';

// Mock data for farmer stats
const FARMER_STATS = [
  {
    id: '1',
    title: 'Active Jobs',
    value: '2',
    icon: 'briefcase',
    color: colors.primary,
  },
  {
    id: '2',
    title: 'Total Workers',
    value: '15',
    icon: 'account-group',
    color: colors.success,
  },
  {
    id: '3',
    title: 'Applications',
    value: '8',
    icon: 'file-document',
    color: colors.info,
  },
  {
    id: '4',
    title: 'Rating',
    value: '4.8',
    icon: 'star',
    color: colors.warning,
  },
];

// Mock jobs data
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Rice Field Workers Needed',
    location: 'Bangalore Rural',
    wage: '₹500/day',
    duration: '5 days',
    applicants: 3,
    status: 'active',
  },
  {
    id: '2',
    title: 'Harvest Season Help',
    location: 'Mysore',
    wage: '₹450/day',
    duration: '2 weeks',
    applicants: 7,
    status: 'active',
  },
];

export default function FarmerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Welcome Back!</ThemedText>
        <Button
          title="Post Job"
          onPress={() => router.push('/(farmer)/post-job')}
          leftIcon="plus"
          style={styles.postButton}
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
          {FARMER_STATS.map((stat, index) => (
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

        {/* Active Jobs */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Active Jobs
          </ThemedText>
          {MOCK_JOBS.map((job) => (
            <JobCard 
              key={job.id}
              job={job}
              onPress={() => router.push(`/(farmer)/job/${job.id}`)}
            />
          ))}
        </ThemedView>
      </ScrollView>
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
  postButton: {
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
}); 