import { useState, useRef } from 'react';
import { StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { BRAND_COLORS, colors, SPACING } from '@/constants/Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Krishi Connect',
    description: 'Bridging farmers and workers for a more productive agricultural future',
    icon: 'sprout',
    gradientColors: [BRAND_COLORS.primary[50], BRAND_COLORS.primary[100]],
    iconColor: BRAND_COLORS.primary[600],
  },
  {
    id: '2',
    title: 'For Farmers',
    description: 'Post jobs, find skilled workers, and manage your agricultural workforce efficiently',
    icon: 'tractor',
    gradientColors: [BRAND_COLORS.accent[50], BRAND_COLORS.accent[100]],
    iconColor: BRAND_COLORS.accent[600],
  },
  {
    id: '3',
    title: 'For Workers',
    description: 'Discover job opportunities, showcase your skills, and connect with farmers',
    icon: 'account-group',
    gradientColors: ['#E8F5E9', '#C8E6C9'],
    iconColor: BRAND_COLORS.primary[600],
  },
  {
    id: '4',
    title: 'Get Started',
    description: 'Join our community and be part of the agricultural revolution',
    icon: 'rocket',
    gradientColors: ['#FFF3E0', '#FFE0B2'],
    iconColor: BRAND_COLORS.accent[600],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/(auth)');
    }
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => (
    <ThemedView style={styles.slide}>
      <LinearGradient
        colors={item.gradientColors}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View 
        entering={FadeIn.delay(300)} 
        style={styles.iconContainer}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={100}
          color={item.iconColor}
        />
      </Animated.View>

      <Animated.View 
        entering={FadeInRight.delay(600)}
        style={styles.content}
      >
        <ThemedText type="title" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.description}>
          {item.description}
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
      />

      <Animated.View 
        entering={FadeIn}
        style={[
          styles.footer,
          { backgroundColor: colors.overlay }
        ]}
      >
        <ThemedView style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? colors.primary
                      : colors.text.disabled,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </ThemedView>

        <ThemedView style={styles.buttons}>
          {currentIndex < ONBOARDING_DATA.length - 1 && (
            <TouchableOpacity
              onPress={() => router.push('/(auth)')}
              style={styles.skipButton}
            >
              <ThemedText style={{ color: colors.text.link }}>
                Skip
              </ThemedText>
            </TouchableOpacity>
          )}

          <Button
            title={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            leftIcon={currentIndex === ONBOARDING_DATA.length - 1 ? "rocket" : "arrow-right"}
            style={styles.nextButton}
          />
        </ThemedView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: SCREEN_WIDTH * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    color: BRAND_COLORS.neutral[900],
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    color: BRAND_COLORS.neutral[600],
    maxWidth: '90%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    gap: SPACING.xl,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    padding: SPACING.md,
  },
  nextButton: {
    minWidth: 120,
  },
}); 