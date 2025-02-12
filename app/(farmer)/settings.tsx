import { useState } from 'react';
import { StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';

type SettingItem = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description?: string;
  type: 'toggle' | 'link';
  route?: `/(farmer)/${string}`;
};

type SettingSection = {
  title: string;
  items: SettingItem[];
};

const SETTINGS_SECTIONS: SettingSection[] = [
  {
    title: 'Preferences',
    items: [
      {
        icon: 'bell',
        title: 'Push Notifications',
        description: 'Get notified about new job applications and updates',
        type: 'toggle',
      },
      {
        icon: 'theme-light-dark',
        title: 'Dark Mode',
        description: 'Switch between light and dark themes',
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        icon: 'account',
        title: 'Profile Settings',
        description: 'Update your personal information',
        type: 'link',
        route: '/(farmer)/profile',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        icon: 'help-circle',
        title: 'Help & Support',
        description: 'Get help with using the app',
        type: 'link',
        route: '/(farmer)/help',
      },
      {
        icon: 'information',
        title: 'About',
        description: 'Learn more about Farbour',
        type: 'link',
        route: '/(farmer)/about',
      },
    ],
  },
];

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  const handleToggle = (setting: string) => {
    switch (setting) {
      case 'Push Notifications':
        setNotifications(!notifications);
        break;
      case 'Dark Mode':
        setDarkMode(!darkMode);
        break;
    }
  };

  const handleNavigation = (route?: string) => {
    if (route) {
      router.push(route as any);
    }
  };

  const renderSettingItem = (item: SettingItem) => {
    const isToggle = item.type === 'toggle';
    let value = false;

    if (isToggle) {
      switch (item.title) {
        case 'Push Notifications':
          value = notifications;
          break;
        case 'Dark Mode':
          value = darkMode;
          break;
      }
    }

    return (
      <TouchableOpacity
        key={item.title}
        style={styles.settingItem}
        onPress={() => isToggle ? handleToggle(item.title) : handleNavigation(item.route)}
      >
        <ThemedView style={styles.settingContent}>
          <ThemedView style={styles.settingIcon}>
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={BRAND_COLORS.primary[400]}
            />
          </ThemedView>
          <ThemedView style={styles.settingText}>
            <ThemedText style={styles.settingTitle}>{item.title}</ThemedText>
            {item.description && (
              <ThemedText style={styles.settingDescription}>
                {item.description}
              </ThemedText>
            )}
          </ThemedView>
          {isToggle ? (
            <Switch
              value={value}
              onValueChange={() => handleToggle(item.title)}
              trackColor={{
                false: BRAND_COLORS.neutral[600],
                true: BRAND_COLORS.primary[400],
              }}
              thumbColor="#fff"
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={BRAND_COLORS.neutral[400]}
            />
          )}
        </ThemedView>
      </TouchableOpacity>
    );
  };

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
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText style={styles.subtitle}>
            Customize your app experience
          </ThemedText>
        </ThemedView>

        {SETTINGS_SECTIONS.map((section) => (
          <ThemedView key={section.title} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
            <ThemedView style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item))}
            </ThemedView>
          </ThemedView>
        ))}

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.version}>
            Version 1.0.0
          </ThemedText>
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '600',
    color: BRAND_COLORS.primary[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  version: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[500],
  },
}); 