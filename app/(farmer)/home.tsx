import { useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/JobCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Temporary mock data
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
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const onRefresh = () => {
    setRefreshing(true);
    // Fetch jobs data
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <ThemedView style={styles.header}>
          <ThemedText type="title">Welcome, Farmer!</ThemedText>
          <Button
            title="Post New Job"
            onPress={() => router.push('/(farmer)/post-job')}
            leftIcon="plus"
            style={styles.postButton}
          />
        </ThemedView>

        {/* Stats Section */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={styles.statsContainer}
        >
          <ThemedView style={[styles.statCard, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name="file-document" size={24} color="white" />
            <ThemedText style={styles.statNumber}>2</ThemedText>
            <ThemedText style={styles.statLabel}>Active Jobs</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: colors.info }]}>
            <MaterialCommunityIcons name="account-group" size={24} color="white" />
            <ThemedText style={styles.statNumber}>10</ThemedText>
            <ThemedText style={styles.statLabel}>Total Applicants</ThemedText>
          </ThemedView>
        </Animated.View>

        {/* Active Jobs Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Your Active Jobs</ThemedText>
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
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  postButton: {
    height: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
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
}); 