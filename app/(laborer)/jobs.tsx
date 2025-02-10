import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING } from '@/constants/Theme';

export default function LaborerJobsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Find Jobs</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
}); 