import { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { colors, shadows, SPACING } from '@/constants/Theme';
import { FilterSheet } from '@/components/FilterSheet';

// Mock data for job categories
const JOB_CATEGORIES = [
  { id: '1', name: 'Rice Farming', icon: 'sprout' },
  { id: '2', name: 'Harvesting', icon: 'wheat' },
  { id: '3', name: 'Equipment', icon: 'tractor' },
  { id: '4', name: 'Livestock', icon: 'cow' },
];

// Extended mock jobs data
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Rice Field Workers Needed',
    description: 'Looking for experienced workers for rice field cultivation.',
    location: 'Bangalore Rural',
    distance: '5 km',
    wage: '₹500/day',
    duration: '5 days',
    rating: 4.8,
    skills: ['Rice Farming', 'Physical Labor'],
    postedAt: '2 hours ago',
    urgent: true,
  },
  {
    id: '2',
    title: 'Wheat Harvesting Support',
    description: 'Need workers for wheat harvesting season.',
    location: 'Mysore',
    distance: '12 km',
    wage: '₹450/day',
    duration: '7 days',
    rating: 4.5,
    skills: ['Harvesting', 'Equipment Operation'],
    postedAt: '5 hours ago',
    urgent: false,
  },
  // Add more mock jobs as needed
];

export default function LaborerJobsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    distance: 10,
    minWage: 300,
    rating: 4.0,
    urgent: false,
  });

  return (
    <ThemedView style={styles.container}>
      {/* Search Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.searchContainer}>
          <MaterialCommunityIcons 
            name="magnify" 
            size={24} 
            color={colors.text.secondary} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text.secondary}
          />
        </ThemedView>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <MaterialCommunityIcons 
            name="filter-variant" 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView>
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {JOB_CATEGORIES.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.categoryCard}
            >
              <ThemedView style={styles.categoryIcon}>
                <MaterialCommunityIcons 
                  name={category.icon} 
                  size={24} 
                  color={colors.primary} 
                />
              </ThemedView>
              <ThemedText style={styles.categoryName}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Jobs List */}
        <ThemedView style={styles.jobsContainer}>
          {MOCK_JOBS.map((job, index) => (
            <Animated.View 
              key={job.id}
              entering={FadeInDown.delay(index * 100)}
            >
              <TouchableOpacity 
                style={styles.jobCard}
                onPress={() => router.push(`/(laborer)/job/${job.id}`)}
              >
                {job.urgent && (
                  <ThemedView style={styles.urgentTag}>
                    <ThemedText style={styles.urgentText}>Urgent</ThemedText>
                  </ThemedView>
                )}
                
                <ThemedText type="subtitle">{job.title}</ThemedText>
                
                <ThemedView style={styles.jobDetails}>
                  <ThemedView style={styles.detailItem}>
                    <MaterialCommunityIcons 
                      name="map-marker" 
                      size={16} 
                      color={colors.text.secondary} 
                    />
                    <ThemedText style={styles.detailText}>
                      {job.location} • {job.distance}
                    </ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.detailItem}>
                    <MaterialCommunityIcons 
                      name="currency-inr" 
                      size={16} 
                      color={colors.text.secondary} 
                    />
                    <ThemedText style={styles.detailText}>
                      {job.wage}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>

                <ThemedView style={styles.jobFooter}>
                  <ThemedView style={styles.skillsContainer}>
                    {job.skills.map((skill) => (
                      <ThemedView key={skill} style={styles.skillChip}>
                        <ThemedText style={styles.skillText}>{skill}</ThemedText>
                      </ThemedView>
                    ))}
                  </ThemedView>
                  
                  <ThemedText style={styles.timeText}>
                    {job.postedAt}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ThemedView>
      </ScrollView>

      <FilterSheet 
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setShowFilters(false);
        }}
      />
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
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  filterButton: {
    padding: SPACING.sm,
  },
  categoriesContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  jobsContainer: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  jobCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...shadows.sm,
  },
  urgentTag: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: colors.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  urgentText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: '500',
  },
  jobDetails: {
    marginTop: SPACING.sm,
    gap: SPACING.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  jobFooter: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  skillChip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
}); 