import { StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';

type SocialLink = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  name: string;
  url: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: 'web',
    name: 'Website',
    url: 'https://farbour.com',
  },
  {
    icon: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com/farbour',
  },
  {
    icon: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/farbour',
  },
  {
    icon: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/farbour',
  },
];

export default function AboutScreen() {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
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
          <MaterialCommunityIcons
            name="sprout"
            size={80}
            color={BRAND_COLORS.primary[400]}
          />
          <ThemedText style={styles.title}>About Farbour</ThemedText>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Our Mission</ThemedText>
          <ThemedText style={styles.sectionText}>
            Farbour aims to revolutionize agricultural employment by connecting farmers with skilled workers, making it easier to find and manage agricultural work opportunities.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>What We Do</ThemedText>
          <ThemedView style={styles.featureList}>
            <ThemedView style={styles.featureItem}>
              <MaterialCommunityIcons
                name="handshake"
                size={24}
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.featureText}>
                Connect farmers with skilled agricultural workers
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.featureItem}>
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.featureText}>
                Ensure safe and reliable work opportunities
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.featureItem}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={BRAND_COLORS.primary[400]}
              />
              <ThemedText style={styles.featureText}>
                Improve agricultural productivity and efficiency
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Connect With Us</ThemedText>
          <ThemedView style={styles.socialLinks}>
            {SOCIAL_LINKS.map((link) => (
              <TouchableOpacity
                key={link.name}
                style={styles.socialLink}
                onPress={() => handleLinkPress(link.url)}
              >
                <MaterialCommunityIcons
                  name={link.icon}
                  size={24}
                  color={BRAND_COLORS.primary[400]}
                />
                <ThemedText style={styles.socialLinkText}>
                  {link.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            © 2024 Farbour. All rights reserved.
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  version: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.md,
  },
  sectionText: {
    fontSize: TYPOGRAPHY.sizes.md,
    lineHeight: 24,
    color: BRAND_COLORS.neutral[300],
  },
  featureList: {
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
  },
  featureText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#fff',
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
    minWidth: 140,
  },
  socialLinkText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[500],
  },
}); 