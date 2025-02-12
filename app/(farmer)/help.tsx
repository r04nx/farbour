import { StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';

type FAQ = {
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    question: 'How do I post a new job?',
    answer: 'Click on the "Post Job" button in the sidebar or on your home screen. Fill in the job details including title, description, location, wage, and required skills.',
  },
  {
    question: 'How do I manage job applications?',
    answer: 'Go to the Jobs section and click on any active job. You can view and manage all applications for that job from there.',
  },
  {
    question: 'How do I contact workers?',
    answer: 'Once a worker has applied to your job, you can view their profile and contact them through the platform.',
  },
  {
    question: 'How do I mark a job as completed?',
    answer: 'Go to the Jobs section, find the active job you want to complete, and use the status dropdown to mark it as completed.',
  },
];

export default function HelpScreen() {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:r04nx.work@gmail.com?subject=Farbour Support Request');
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
            name="help-circle"
            size={80}
            color={BRAND_COLORS.primary[400]}
          />
          <ThemedText style={styles.title}>Help & Support</ThemedText>
          <ThemedText style={styles.subtitle}>
            Get help with using Farbour
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Support</ThemedText>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleEmailSupport}
          >
            <ThemedView style={styles.contactIconContainer}>
              <MaterialCommunityIcons
                name="email"
                size={24}
                color={BRAND_COLORS.primary[400]}
              />
            </ThemedView>
            <ThemedView style={styles.contactContent}>
              <ThemedText style={styles.contactTitle}>Email Support</ThemedText>
              <ThemedText style={styles.contactText}>
                r04nx.work@gmail.com
              </ThemedText>
            </ThemedView>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={BRAND_COLORS.neutral[400]}
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
          <ThemedView style={styles.faqList}>
            {FAQS.map((faq, index) => (
              <ThemedView 
                key={index}
                style={styles.faqItem}
              >
                <ThemedText style={styles.question}>{faq.question}</ThemedText>
                <ThemedText style={styles.answer}>{faq.answer}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
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
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.md,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  contactText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.primary[400],
  },
  faqList: {
    gap: SPACING.md,
  },
  faqItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    borderRadius: 12,
  },
  question: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  answer: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[300],
    lineHeight: 20,
  },
}); 