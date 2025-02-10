import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type JobCardProps = {
  job: {
    id: string;
    title: string;
    location: string;
    wage: string;
    duration: string;
    applicants: number;
    status: string;
  };
  onPress: () => void;
};

export function JobCard({ job, onPress }: JobCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={[styles.container, { borderColor: colors.border }]}>
        <ThemedText type="defaultSemiBold">{job.title}</ThemedText>
        
        <ThemedView style={styles.detailsContainer}>
          <ThemedView style={styles.detail}>
            <MaterialCommunityIcons 
              name="map-marker" 
              size={16} 
              color={colors.placeholder} 
            />
            <ThemedText style={styles.detailText}>{job.location}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detail}>
            <MaterialCommunityIcons 
              name="currency-inr" 
              size={16} 
              color={colors.placeholder} 
            />
            <ThemedText style={styles.detailText}>{job.wage}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detail}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={16} 
              color={colors.placeholder} 
            />
            <ThemedText style={styles.detailText}>{job.duration}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedView style={styles.detail}>
            <MaterialCommunityIcons 
              name="account-group" 
              size={16} 
              color={colors.primary} 
            />
            <ThemedText style={{ color: colors.primary }}>
              {job.applicants} Applicants
            </ThemedText>
          </ThemedView>

          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color={colors.placeholder} 
          />
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
}); 