import { StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Theme, SPACING } from '@/constants/Theme';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = Theme[theme];

  const settingsOptions = [
    {
      icon: 'account',
      title: 'Profile Settings',
      onPress: () => router.push('/profile-settings'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      onPress: () => router.push('/notifications-settings'),
    },
    {
      icon: 'translate',
      title: 'Language',
      onPress: () => router.push('/language-settings'),
    },
    {
      icon: 'shield-check',
      title: 'Privacy & Security',
      onPress: () => router.push('/privacy-settings'),
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      onPress: () => router.push('/help'),
    },
    {
      icon: 'information',
      title: 'About',
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Settings</ThemedText>

      {/* Theme Switcher */}
      <ThemedView style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingLeft}>
            <MaterialCommunityIcons
              name={theme === 'light' ? 'white-balance-sunny' : 'moon-waning-crescent'}
              size={24}
              color={currentTheme.colors.text.primary}
            />
            <ThemedText style={styles.settingTitle}>Dark Mode</ThemedText>
          </ThemedView>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: currentTheme.colors.primary }}
            thumbColor={currentTheme.colors.background}
          />
        </ThemedView>
      </ThemedView>

      {/* Other Settings */}
      <ThemedView style={[styles.card, { backgroundColor: currentTheme.colors.surface }]}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={option.title}
            style={[
              styles.settingItem,
              index < settingsOptions.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: currentTheme.colors.border,
              },
            ]}
            onPress={option.onPress}
          >
            <ThemedView style={styles.settingLeft}>
              <MaterialCommunityIcons
                name={option.icon}
                size={24}
                color={currentTheme.colors.text.primary}
              />
              <ThemedText style={styles.settingTitle}>{option.title}</ThemedText>
            </ThemedView>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={currentTheme.colors.text.secondary}
            />
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Version Info */}
      <ThemedView style={styles.versionContainer}>
        <ThemedText style={{ color: currentTheme.colors.text.secondary }}>
          Version 1.0.0
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  card: {
    borderRadius: 12,
    marginBottom: SPACING.lg,
    ...Theme.light.shadows.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: SPACING.lg,
  },
}); 