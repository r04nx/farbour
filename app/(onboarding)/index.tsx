import { useState, useRef } from 'react';
import { StyleSheet, Dimensions, FlatList, TouchableOpacity, Platform, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInRight, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { BRAND_COLORS, SPACING, TYPOGRAPHY } from '@/constants/Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to Farbour',
    subtitle: 'Your Agricultural Partner',
    description: 'Connecting farmers and workers for a more productive agricultural future',
    icon: 'sprout',
    gradientColors: ['#E8F5E9', '#C8E6C9'],
    iconColor: BRAND_COLORS.primary[600],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'For Farmers',
    subtitle: 'Manage Your Farm Better',
    description: 'Post jobs, find skilled workers, and manage your agricultural workforce efficiently',
    icon: 'tractor',
    gradientColors: ['#FFF3E0', '#FFE0B2'],
    iconColor: BRAND_COLORS.accent[600],
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'For Workers',
    subtitle: 'Find Great Opportunities',
    description: 'Discover job opportunities, showcase your skills, and connect with farmers',
    icon: 'account-group',
    gradientColors: ['#E3F2FD', '#BBDEFB'],
    iconColor: BRAND_COLORS.primary[600],
    image: 'https://images.unsplash.com/photo-1593004571499-3c80616323ed?q=80&w=2574&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Get Started',
    subtitle: 'Join Our Community',
    description: 'Be part of the agricultural revolution and grow together',
    icon: 'rocket',
    gradientColors: ['#F3E5F5', '#E1BEE7'],
    iconColor: BRAND_COLORS.accent[600],
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2574&auto=format&fit=crop',
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
      router.push('/(auth)/sign-in');
    }
  };

  const renderItem = ({ item, index }: { item: typeof ONBOARDING_DATA[0], index: number }) => (
    <Animated.View 
      entering={SlideInRight.delay(index * 100)}
      style={styles.slide}
    >
      <Animated.Image
        source={{ uri: item.image }}
        style={styles.backgroundImage}
        entering={FadeIn.delay(200)}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />
      
      <BlurView intensity={80} style={styles.contentContainer}>
        <Animated.View 
          entering={FadeInUp.delay(400)} 
          style={styles.iconContainer}
        >
          <LinearGradient
            colors={item.gradientColors}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={80}
              color={item.iconColor}
              style={styles.icon}
            />
          </LinearGradient>
        </Animated.View>

        <Animated.View 
          entering={FadeInRight.delay(600)}
          style={styles.textContent}
        >
          <ThemedText style={styles.title}>
            {item.title}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {item.subtitle}
          </ThemedText>
          <ThemedText style={styles.description}>
            {item.description}
          </ThemedText>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
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
        style={styles.footer}
      >
        <BlurView intensity={30} style={styles.footerContent}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === currentIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.buttons}>
            {currentIndex < ONBOARDING_DATA.length - 1 ? (
              <>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/sign-in')}
                  style={styles.skipButton}
                >
                  <ThemedText style={styles.skipText}>
                    Skip
                  </ThemedText>
                </TouchableOpacity>

                <Button
                  title="Next"
                  onPress={handleNext}
                  leftIcon="arrow-right"
                  style={styles.nextButton}
                />
              </>
            ) : (
              <Button
                title="Get Started"
                onPress={handleNext}
                leftIcon="rocket"
                style={styles.getStartedButton}
              />
            )}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  icon: {
    transform: [{ scale: 1.2 }],
  },
  textContent: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: BRAND_COLORS.primary[400],
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerContent: {
    padding: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
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
    gap: SPACING.md,
  },
  skipButton: {
    padding: SPACING.md,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    minWidth: 120,
    height: 50,
    backgroundColor: BRAND_COLORS.primary[500],
  },
  getStartedButton: {
    flex: 1,
    height: 56,
    backgroundColor: BRAND_COLORS.primary[500],
  },
}); 