import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { Stack, usePathname, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BRAND_COLORS, SPACING, TYPOGRAPHY } from '@/constants/Theme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

type MenuItem = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'home',
    label: 'Home',
    route: '/(farmer)/home',
  },
  {
    icon: 'briefcase',
    label: 'Jobs',
    route: '/(farmer)/jobs',
  },
  {
    icon: 'plus-circle',
    label: 'Post Job',
    route: '/(farmer)/post-job',
  },
  {
    icon: 'account-multiple',
    label: 'Applications',
    route: '/(farmer)/applications',
  },
  {
    icon: 'account-group',
    label: 'Workers',
    route: '/(farmer)/workers',
  },
];

const BOTTOM_MENU_ITEMS: MenuItem[] = [
  {
    icon: 'account',
    label: 'Profile',
    route: '/(farmer)/profile',
  },
  {
    icon: 'help-circle',
    label: 'Help',
    route: '/(farmer)/help',
  },
  {
    icon: 'information',
    label: 'About',
    route: '/(farmer)/about',
  },
  {
    icon: 'logout',
    label: 'Logout',
    route: '/(farmer)/logout',
  },
];

export default function FarmerLayout() {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState<string>('/(farmer)/home');

  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
    }
  }, [pathname]);

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ThemedView style={[styles.sidebar, IS_MOBILE && styles.sidebarMobile]}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="sprout"
            size={32}
            color={BRAND_COLORS.primary[400]}
          />
          {!IS_MOBILE && (
            <ThemedText style={styles.logoText}>
              Farbour
            </ThemedText>
          )}
        </View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                activeRoute === item.route && styles.menuItemActive,
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={activeRoute === item.route ? BRAND_COLORS.primary[400] : 'rgba(255, 255, 255, 0.6)'}
              />
              {!IS_MOBILE && (
                <ThemedText
                  style={[
                    styles.menuLabel,
                    activeRoute === item.route && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomMenuContainer}>
          {BOTTOM_MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                activeRoute === item.route && styles.menuItemActive,
              ]}
              onPress={() => handleNavigation(item.route)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={activeRoute === item.route ? BRAND_COLORS.primary[400] : 'rgba(255, 255, 255, 0.6)'}
              />
              {!IS_MOBILE && (
                <ThemedText
                  style={[
                    styles.menuLabel,
                    activeRoute === item.route && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.neutral[900],
  },
  sidebar: {
    width: 200,
    height: SCREEN_HEIGHT,
    backgroundColor: BRAND_COLORS.neutral[800],
    paddingVertical: SPACING.lg,
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: BRAND_COLORS.neutral[700],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sidebarMobile: {
    width: 60,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: '#fff',
  },
  menuContainer: {
    width: '100%',
    gap: SPACING.xs,
  },
  content: {
    flex: 1,
    backgroundColor: BRAND_COLORS.neutral[900],
  },
  menuItem: {
    width: '100%',
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    opacity: 0.8,
  },
  menuItemActive: {
    opacity: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: BRAND_COLORS.primary[400],
  },
  bottomMenuContainer: {
    width: '100%',
    gap: SPACING.xs,
    marginTop: 'auto',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.neutral[700],
  },
}); 