import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function UserTypeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleUserTypeSelect = (type: 'farmer' | 'laborer') => {
    // Store user type in local storage or context
    router.push(`/(${type})/home`);
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeIn.delay(200)} style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          I am a...
        </ThemedText>

        <Button
          title="Farmer"
          onPress={() => handleUserTypeSelect('farmer')}
          style={styles.button}
          leftIcon="tractor"
        />

        <ThemedText style={styles.orText}>or</ThemedText>

        <Button
          title="Farm Worker"
          onPress={() => handleUserTypeSelect('laborer')}
          style={styles.button}
          leftIcon="account-hard-hat"
        />

        <ThemedView style={styles.infoContainer}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={colors.info}
          />
          <ThemedText style={styles.infoText}>
            You can change your user type later in settings
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    marginBottom: 32,
  },
  button: {
    width: '100%',
    height: 60,
  },
  orText: {
    fontSize: 16,
    marginVertical: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
  },
}); 