import { StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedView } from './ThemedView';
import { colors } from '@/constants/Theme';

export function LoadingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 