import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, SPACING } from '@/constants/Theme';
import { ThemedText } from './ThemedText';

interface GuideCharacterProps {
  message: string;
  icon?: string;
}

export function GuideCharacter({ message, icon = 'robot' }: GuideCharacterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
          name={icon} 
          size={32} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.messageContainer}>
        <ThemedText style={styles.message}>{message}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 16,
    padding: SPACING.md,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 