import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotificationType } from '@/types/database';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

type QuickAction = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
  description: string;
};

type Activity = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

export default function FarmerHomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalWorkers: 0,
    completedJobs: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const { profile } = useAuth();

  // Fetch farmer stats
  const fetchStats = async () => {
    try {
      if (!profile?.id) return;

      // Get active jobs count
      const { data: activeJobs, error: activeJobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('farmer_id', profile.id)
        .eq('status', 'active');

      // Get completed jobs count
      const { data: completedJobs, error: completedJobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('farmer_id', profile.id)
        .eq('status', 'completed');

      // Get total unique workers
      const { data: workers, error: workersError } = await supabase
        .from('job_applications')
        .select('laborer_id')
        .eq('status', 'accepted')
        .eq('job_id.farmer_id', profile.id)
        .limit(1000);

      if (activeJobsError || completedJobsError || workersError) {
        throw new Error('Error fetching stats');
      }

      setStats({
        activeJobs: activeJobs?.length || 0,
        completedJobs: completedJobs?.length || 0,
        totalWorkers: workers?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load stats');
    }
  };

  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      if (!profile?.id) return;

      // Get recent notifications
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationsError) throw notificationsError;

      // Transform notifications into activities
      const transformedActivities = notifications?.map(notification => {
        let icon: keyof typeof MaterialCommunityIcons.glyphMap = 'bell';
        let color = BRAND_COLORS.primary[500];

        switch (notification.type) {
          case 'application_received':
            icon = 'account-plus';
            color = BRAND_COLORS.accent[500];
            break;
          case 'job_completed':
            icon = 'check-circle';
            color = BRAND_COLORS.primary[700];
            break;
          case 'worker_hired':
            icon = 'account-check';
            color = BRAND_COLORS.accent[700];
            break;
          default:
            break;
        }

        return {
          id: notification.id,
          type: notification.type as NotificationType,
          title: notification.title,
          description: notification.message,
          timestamp: formatRelativeTime(new Date(notification.created_at)),
          icon,
          color,
        };
      }) || [];

      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to load activities');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    await Promise.all([fetchStats(), fetchActivities()]);
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await handleRefresh();
      setLoading(false);
    };

    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const quickActions: QuickAction[] = [
    {
      icon: 'plus-circle',
      label: 'Post Job',
      description: 'Create a new job listing',
      onPress: () => router.push('/(farmer)/post-job' as any),
      color: BRAND_COLORS.primary[500],
    },
    {
      icon: 'account-group',
      label: 'Workers',
      description: 'Manage your workers',
      onPress: () => router.push('/(farmer)/workers' as any),
      color: BRAND_COLORS.accent[500],
    },
    {
      icon: 'calendar-check',
      label: 'Jobs',
      description: 'View active jobs',
      onPress: () => router.push('/(farmer)/jobs' as any),
      color: BRAND_COLORS.primary[700],
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  // Example quote of the day
  const quoteOfTheDay =
    'The farmer has to be an optimist or he wouldn\'t still be a farmer. - Will Rogers';

  // Show error if present
  if (error) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={BRAND_COLORS.accent[500]} />
        <ThemedText style={{ color: '#fff', fontSize: 18, marginTop: 16, textAlign: 'center' }}>{error}</ThemedText>
        <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 24 }}>
          <ThemedText style={{ color: BRAND_COLORS.primary[400], fontSize: 16 }}>Try Again</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

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
        style={styles.header}
      >
        <ThemedText style={styles.greeting}>Welcome back,</ThemedText>
        <ThemedText style={styles.name}>{profile?.name || 'Farmer'}</ThemedText>

        {/* Quote of the day */}
        <ThemedView style={{ marginVertical: 12, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 12 }}>
          <ThemedText style={{ color: '#fff', fontStyle: 'italic', textAlign: 'center', fontSize: 15 }}>{quoteOfTheDay}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statsRow}>
            <ThemedView style={styles.statItem}>
              <MaterialCommunityIcons
                name="briefcase"
                size={20}
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.statValue}>{stats.activeJobs}</ThemedText>
              <ThemedText style={styles.statLabel}>Active Jobs</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={BRAND_COLORS.accent[400]}
              />
              <ThemedText style={styles.statValue}>{stats.totalWorkers}</ThemedText>
              <ThemedText style={styles.statLabel}>Workers</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.statValue}>{stats.completedJobs}</ThemedText>
              <ThemedText style={styles.statLabel}>Completed</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Animated.View>

      <ThemedView style={styles.actionsContainer}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        <ThemedView style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                { width: IS_MOBILE ? '100%' : '32%' }
              ]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <ThemedView style={[styles.actionContent, { backgroundColor: action.color }]}>
                <MaterialCommunityIcons
                  name={action.icon}
                  size={24}
                  color="#fff"
                />
                <ThemedView style={styles.actionTextContainer}>
                  <ThemedText style={styles.actionLabel}>
                    {action.label}
                  </ThemedText>
                  <ThemedText style={styles.actionDescription}>
                    {action.description}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.activitiesContainer}>
        <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
        <ThemedView style={styles.activitiesList}>
          {error ? (
            <ThemedView style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={BRAND_COLORS.accent[500]}
              />
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          ) : activities.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={BRAND_COLORS.neutral[400]}
              />
              <ThemedText style={styles.emptyText}>
                No recent activities to show
              </ThemedText>
            </ThemedView>
          ) : (
            activities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                onPress={() => {
                  // Handle activity press based on type and data
                  if (activity.type === 'application_received') {
                    router.push('/(farmer)/applications');
                  } else if (activity.type === 'job_completed') {
                    router.push('/(farmer)/jobs');
                  }
                }}
                activeOpacity={0.8}
              >
                <ThemedView style={[styles.activityIconContainer, { backgroundColor: activity.color }]}>
                  <MaterialCommunityIcons
                    name={activity.icon}
                    size={16}
                    color="#fff"
                  />
                </ThemedView>
                <ThemedView style={styles.activityContent}>
                  <ThemedView style={styles.activityHeader}>
                    <ThemedText style={styles.activityTitle}>
                      {activity.title}
                    </ThemedText>
                    <ThemedText style={styles.activityTimestamp}>
                      {activity.timestamp}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.activityDescription}>
                    {activity.description}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))
          )}
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
    padding: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  name: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: SPACING.md,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: SPACING.sm,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actionsContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  actionButton: {
    marginBottom: SPACING.xs,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.md,
    minHeight: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionTextContainer: {
    flex: 1,
    gap: 4,
  },
  actionLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  actionDescription: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activitiesContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  activitiesList: {
    gap: SPACING.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    minHeight: 60,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
    gap: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: '#fff',
  },
  activityTimestamp: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  activityDescription: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.accent[500],
    flex: 1,
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
    flex: 1,
  },
}); 