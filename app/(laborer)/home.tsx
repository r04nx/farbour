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
import { colors, SPACING } from '@/constants/Theme';

// Mock data
const MOCK_STATS = {
  activeApplications: 3,
  totalEarnings: '₹15,000',
  completedJobs: 12,
  rating: 4.5,
};

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
      <ThemedText type="title" style={styles.title}>
        Welcome Back!
      </ThemedText>
      
      <GuideCharacter 
        message="Hi! I'm here to help you find the perfect job. Let's get started!"
        icon="robot-happy"
      />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: showGuide ? 120 : SPACING.xl },
        ]}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Welcome, Worker!</ThemedText>
          <Button
            title="Find Jobs"
            onPress={() => router.push('/(laborer)/jobs')}
            leftIcon="briefcase-search"
            style={styles.findButton}
          />
        </ThemedView>

        {/* Stats Grid */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={styles.statsGrid}
        >
          <ThemedView style={[styles.statCard, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="clipboard-check" size={24} color="white" />
            <ThemedText style={styles.statNumber}>{MOCK_STATS.activeApplications}</ThemedText>
            <ThemedText style={styles.statLabel}>Active Applications</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: colors.success }]}>
            <MaterialCommunityIcons name="currency-inr" size={24} color="white" />
            <ThemedText style={styles.statNumber}>{MOCK_STATS.totalEarnings}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Earnings</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: colors.info }]}>
            <MaterialCommunityIcons name="briefcase-check" size={24} color="white" />
            <ThemedText style={styles.statNumber}>{MOCK_STATS.completedJobs}</ThemedText>
            <ThemedText style={styles.statLabel}>Completed Jobs</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: colors.warning }]}>
            <MaterialCommunityIcons name="star" size={24} color="white" />
            <ThemedText style={styles.statNumber}>{MOCK_STATS.rating}</ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Upcoming Jobs */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Upcoming Jobs</ThemedText>
          {MOCK_UPCOMING_JOBS.map((job) => (
            <ThemedView key={job.id} style={styles.jobCard}>
              <ThemedView style={styles.jobHeader}>
                <ThemedText type="defaultSemiBold">{job.title}</ThemedText>
                <ThemedText style={styles.wage}>{job.wage}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.jobDetails}>
                <ThemedView style={styles.detailItem}>
                  <MaterialCommunityIcons 
                    name="calendar" 
                    size={16} 
                    color={colors.placeholder} 
                  />
                  <ThemedText style={styles.detailText}>
                    {job.date} at {job.time}
                  </ThemedText>
                </ThemedView>

                <ThemedView style={styles.detailItem}>
                  <MaterialCommunityIcons 
                    name="map-marker" 
                    size={16} 
                    color={colors.placeholder} 
                  />
                  <ThemedText style={styles.detailText}>{job.location}</ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>

      {showGuide && (
        <GuideCharacter
          messages={GUIDE_MESSAGES}
          onComplete={() => setShowGuide(false)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: SPACING.md,
  },
  title: {
    marginBottom: SPACING.lg,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  findButton: {
    height: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  jobCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wage: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  jobDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.placeholder,
  },
}); 