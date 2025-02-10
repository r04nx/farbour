import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING } from '@/constants/Theme';

export default function LaborerApplicationsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Jobs</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
}); 