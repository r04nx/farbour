import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';

type Worker = {
  id: string;
  name: string;
  avatar_url?: string;
  location: string;
  rating: number;
  total_jobs: number;
  skills: string[];
  status: 'available' | 'working' | 'unavailable';
  last_hired: string;
};

// Mock data for workers
const MOCK_WORKERS: Worker[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Ludhiana, Punjab',
    rating: 4.8,
    total_jobs: 24,
    skills: ['Harvesting', 'Machinery Operation', 'Planting'],
    status: 'available',
    last_hired: '2 weeks ago',
  },
  {
    id: '2',
    name: 'Amit Singh',
    location: 'Amritsar, Punjab',
    rating: 4.5,
    total_jobs: 18,
    skills: ['Crop Management', 'Irrigation', 'Pesticide Application'],
    status: 'working',
    last_hired: '1 week ago',
  },
  {
    id: '3',
    name: 'Priya Patel',
    location: 'Guntur, Andhra Pradesh',
    rating: 4.9,
    total_jobs: 32,
    skills: ['Rice Planting', 'Harvesting', 'Team Management'],
    status: 'available',
    last_hired: '3 days ago',
  },
  {
    id: '4',
    name: 'Suresh Reddy',
    location: 'Warangal, Telangana',
    rating: 4.7,
    total_jobs: 15,
    skills: ['Cotton Picking', 'Crop Protection', 'Equipment Maintenance'],
    status: 'unavailable',
    last_hired: '1 month ago',
  },
];

export default function WorkersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredWorkers = MOCK_WORKERS.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = !selectedStatus || worker.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'available':
        return BRAND_COLORS.primary[500];
      case 'working':
        return BRAND_COLORS.accent[500];
      case 'unavailable':
        return BRAND_COLORS.neutral[500];
      default:
        return BRAND_COLORS.neutral[500];
    }
  };

  const renderStatusBadge = (status: Worker['status']) => (
    <ThemedView
      style={[
        styles.statusBadge,
        { backgroundColor: `${getStatusColor(status)}20` },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          { backgroundColor: getStatusColor(status) },
        ]}
      />
      <ThemedText
        style={[
          styles.statusText,
          { color: getStatusColor(status) },
        ]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.delay(200)}
        style={styles.content}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Workers</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your workforce and find skilled workers
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <Input
            placeholder="Search workers by name, location, or skills"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon="magnify"
            style={styles.searchInput}
          />

          <ThemedView style={styles.filterButtons}>
            {(['available', 'working', 'unavailable'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  selectedStatus === status && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    selectedStatus === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.workersList}>
          {filteredWorkers.map((worker) => (
            <TouchableOpacity
              key={worker.id}
              style={styles.workerCard}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.workerHeader}>
                <ThemedView style={styles.workerInfo}>
                  <ThemedView style={styles.avatar}>
                    <MaterialCommunityIcons
                      name="account"
                      size={24}
                      color={BRAND_COLORS.neutral[400]}
                    />
                  </ThemedView>
                  <ThemedView>
                    <ThemedText style={styles.workerName}>{worker.name}</ThemedText>
                    <ThemedView style={styles.locationContainer}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={14}
                        color={BRAND_COLORS.neutral[400]}
                      />
                      <ThemedText style={styles.locationText}>
                        {worker.location}
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                {renderStatusBadge(worker.status)}
              </ThemedView>

              <ThemedView style={styles.workerStats}>
                <ThemedView style={styles.statItem}>
                  <ThemedView style={styles.ratingContainer}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color={BRAND_COLORS.accent[400]}
                    />
                    <ThemedText style={styles.ratingText}>
                      {worker.rating}
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.statLabel}>Rating</ThemedText>
                </ThemedView>

                <ThemedView style={styles.statDivider} />

                <ThemedView style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {worker.total_jobs}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Jobs</ThemedText>
                </ThemedView>

                <ThemedView style={styles.statDivider} />

                <ThemedView style={styles.statItem}>
                  <ThemedText style={styles.statValue}>
                    {worker.last_hired}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>Last Hired</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.skillsContainer}>
                {worker.skills.map((skill, index) => (
                  <ThemedView key={index} style={styles.skillChip}>
                    <ThemedText style={styles.skillText}>{skill}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </TouchableOpacity>
          ))}
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
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: BRAND_COLORS.neutral[400],
  },
  searchContainer: {
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterButtonActive: {
    backgroundColor: BRAND_COLORS.primary[500],
  },
  filterButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  workersList: {
    gap: SPACING.md,
  },
  workerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workerName: {
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
  workerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: BRAND_COLORS.neutral[400],
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
}); 