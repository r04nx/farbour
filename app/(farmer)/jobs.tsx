import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { Job, JobStatus } from '@/types/database';
import { getJobs, updateJob } from '@/lib/database';

type TabType = 'active' | 'completed' | 'draft' | 'cancelled';

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchJobs = async () => {
    if (!user) return;
    try {
      const data = await getJobs(user.id, activeTab as JobStatus);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [activeTab, user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      await updateJob(jobId, { status: newStatus });
      await fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'active':
        return BRAND_COLORS.primary[500];
      case 'completed':
        return BRAND_COLORS.accent[500];
      case 'draft':
        return BRAND_COLORS.neutral[500];
      case 'cancelled':
        return BRAND_COLORS.neutral[700];
      default:
        return BRAND_COLORS.neutral[500];
    }
  };

  const renderJobCard = (job: Job) => (
    <ThemedView key={job.id} style={styles.jobCard}>
      <ThemedView style={styles.jobHeader}>
        <ThemedView>
          <ThemedText style={styles.jobTitle}>{job.title}</ThemedText>
          <ThemedView style={styles.locationContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color={BRAND_COLORS.neutral[400]}
            />
            <ThemedText style={styles.locationText}>
              {job.location.district}, {job.location.state}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(job.status)}20` },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(job.status) },
            ]}
          />
          <ThemedText
            style={[
              styles.statusText,
              { color: getStatusColor(job.status) },
            ]}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.jobDescription}>
        {job.description}
      </ThemedText>

      <ThemedView style={styles.jobDetails}>
        <ThemedView style={styles.detailItem}>
          <MaterialCommunityIcons
            name="currency-inr"
            size={16}
            color={BRAND_COLORS.neutral[400]}
          />
          <ThemedText style={styles.detailText}>
            ₹{job.wage_per_day}/day
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailItem}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={BRAND_COLORS.neutral[400]}
          />
          <ThemedText style={styles.detailText}>
            {job.workers_needed} workers needed
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailItem}>
          <MaterialCommunityIcons
            name="calendar-range"
            size={16}
            color={BRAND_COLORS.neutral[400]}
          />
          <ThemedText style={styles.detailText}>
            {new Date(job.start_date).toLocaleDateString()} - {new Date(job.end_date).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.skillsContainer}>
        {job.skills_required.map((skill, index) => (
          <ThemedView key={index} style={styles.skillChip}>
            <ThemedText style={styles.skillText}>{skill}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.cardFooter}>
        <Button
          title={`${job.applications_count} Applications`}
          onPress={() => router.push({
            pathname: '/(farmer)/applications',
            params: { jobId: job.id }
          })}
          leftIcon="account-multiple"
          variant="secondary"
          size="small"
        />

        {job.status === 'draft' && (
          <ThemedView style={styles.actionButtons}>
            <Button
              title="Publish"
              onPress={() => handleStatusChange(job.id, 'active')}
              leftIcon="rocket-launch"
              size="small"
            />
            <Button
              title="Delete"
              onPress={() => handleStatusChange(job.id, 'cancelled')}
              leftIcon="delete"
              variant="outline"
              size="small"
            />
          </ThemedView>
        )}

        {job.status === 'active' && (
          <ThemedView style={styles.actionButtons}>
            <Button
              title="Complete"
              onPress={() => handleStatusChange(job.id, 'completed')}
              leftIcon="check-circle"
              size="small"
            />
            <Button
              title="Cancel"
              onPress={() => handleStatusChange(job.id, 'cancelled')}
              leftIcon="close-circle"
              variant="outline"
              size="small"
            />
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.content}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Jobs</ThemedText>
          <Button
            title="Post New Job"
            onPress={() => router.push('/(farmer)/post-job')}
            leftIcon="plus"
          />
        </ThemedView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {(['active', 'completed', 'draft', 'cancelled'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedView style={styles.jobsList}>
          {loading ? (
            <ThemedText style={styles.emptyText}>Loading...</ThemedText>
          ) : jobs.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No {activeTab} jobs found
            </ThemedText>
          ) : (
            jobs.map(renderJobCard)
          )}
        </ThemedView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.neutral[900],
  },
  content: {
    padding: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
  },
  tabsContainer: {
    marginBottom: SPACING.lg,
  },
  tab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeTab: {
    backgroundColor: BRAND_COLORS.primary[500],
  },
  tabText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500',
  },
  jobsList: {
    gap: SPACING.md,
  },
  jobCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[300],
    lineHeight: 20,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  skillChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
  },
  skillText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: BRAND_COLORS.neutral[300],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: BRAND_COLORS.neutral[400],
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
}); 