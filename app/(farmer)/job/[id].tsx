import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data - replace with actual data fetching
const MOCK_JOB = {
  id: '1',
  title: 'Rice Field Workers Needed',
  description: 'Looking for experienced workers for rice field cultivation. Tasks include planting, weeding, and general maintenance.',
  location: 'Bangalore Rural',
  wage: '₹500/day',
  duration: '5 days',
  workersNeeded: 5,
  skills: ['Rice Farming', 'Physical Labor', 'Agriculture'],
  status: 'active',
  applicants: [
    {
      id: '1',
      name: 'Rajesh Kumar',
      age: 28,
      experience: '5 years',
      rating: 4.5,
      status: 'pending',
    },
    {
      id: '2',
      name: 'Suresh Patel',
      age: 35,
      experience: '8 years',
      rating: 4.8,
      status: 'accepted',
    },
    {
      id: '3',
      name: 'Amit Singh',
      age: 30,
      experience: '3 years',
      rating: 4.2,
      status: 'pending',
    },
  ],
};

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<'details' | 'applicants'>('details');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleStatusChange = (applicantId: string, newStatus: 'accepted' | 'rejected') => {
    // TODO: Update applicant status
    console.log(`Updating applicant ${applicantId} status to ${newStatus}`);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Job Details</ThemedText>
        <TouchableOpacity onPress={() => {/* Show more options */}}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </ThemedView>

      {/* Tab Buttons */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'details' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('details')}>
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === 'details' && { color: colors.primary },
            ]}>
            Details
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'applicants' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setSelectedTab('applicants')}>
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === 'applicants' && { color: colors.primary },
            ]}>
            Applicants ({MOCK_JOB.applicants.length})
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView contentContainerStyle={styles.content}>
        {selectedTab === 'details' ? (
          <Animated.View entering={FadeIn} style={styles.detailsContainer}>
            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold">{MOCK_JOB.title}</ThemedText>
              <ThemedText style={styles.description}>{MOCK_JOB.description}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold">Job Details</ThemedText>
              <DetailItem
                icon="map-marker"
                label="Location"
                value={MOCK_JOB.location}
              />
              <DetailItem
                icon="currency-inr"
                label="Wage"
                value={MOCK_JOB.wage}
              />
              <DetailItem
                icon="clock-outline"
                label="Duration"
                value={MOCK_JOB.duration}
              />
              <DetailItem
                icon="account-group"
                label="Workers Needed"
                value={MOCK_JOB.workersNeeded.toString()}
              />
            </ThemedView>

            <ThemedView style={styles.section}>
              <ThemedText type="defaultSemiBold">Required Skills</ThemedText>
              <ThemedView style={styles.skillsContainer}>
                {MOCK_JOB.skills.map((skill) => (
                  <ThemedView key={skill} style={styles.skillChip}>
                    <ThemedText style={styles.skillText}>{skill}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn} style={styles.applicantsContainer}>
            {MOCK_JOB.applicants.map((applicant) => (
              <ThemedView key={applicant.id} style={styles.applicantCard}>
                <ThemedView style={styles.applicantHeader}>
                  <ThemedView style={styles.applicantInfo}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={40}
                      color={colors.placeholder}
                    />
                    <ThemedView>
                      <ThemedText type="defaultSemiBold">{applicant.name}</ThemedText>
                      <ThemedText style={styles.subInfo}>
                        {applicant.age} years • {applicant.experience} experience
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <ThemedView style={styles.ratingContainer}>
                    <MaterialCommunityIcons name="star" size={16} color="#FFB800" />
                    <ThemedText style={styles.rating}>{applicant.rating}</ThemedText>
                  </ThemedView>
                </ThemedView>

                {applicant.status === 'pending' ? (
                  <ThemedView style={styles.actionButtons}>
                    <Button
                      title="Accept"
                      onPress={() => handleStatusChange(applicant.id, 'accepted')}
                      style={[styles.actionButton, { backgroundColor: colors.success }]}
                    />
                    <Button
                      title="Reject"
                      onPress={() => handleStatusChange(applicant.id, 'rejected')}
                      variant="outline"
                      style={styles.actionButton}
                    />
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.statusContainer}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={colors.success}
                    />
                    <ThemedText style={{ color: colors.success }}>
                      Accepted
                    </ThemedText>
                  </ThemedView>
                )}
              </ThemedView>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.detailItem}>
      <ThemedView style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText style={styles.detailValue}>{value}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  detailsContainer: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  description: {
    lineHeight: 22,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.placeholder,
  },
  detailValue: {
    fontSize: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: Colors.light.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
  },
  applicantsContainer: {
    gap: 16,
  },
  applicantCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 16,
  },
  applicantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subInfo: {
    fontSize: 14,
    color: Colors.light.placeholder,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 