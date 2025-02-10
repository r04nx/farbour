import { Dimensions } from 'react-native';

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 375,
  TABLET: 768,
  DESKTOP: 1024,
};

// Design system spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography system
export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Brand color palette
export const BRAND_COLORS = {
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main primary color
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  accent: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Main accent color
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Theme configuration
export const Theme = {
  colors: {
    // Main colors
    primary: BRAND_COLORS.primary[500],
    primaryDark: BRAND_COLORS.primary[700],
    primaryLight: BRAND_COLORS.primary[300],
    accent: BRAND_COLORS.accent[500],
    
    // Background colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: BRAND_COLORS.neutral[50],
    overlay: 'rgba(255, 255, 255, 0.95)',
    
    // Text colors
    text: {
      primary: BRAND_COLORS.neutral[900],      // Almost black for main text
      secondary: BRAND_COLORS.neutral[700],     // Dark gray for secondary text
      tertiary: BRAND_COLORS.neutral[500],      // Medium gray for subtle text
      inverse: '#FFFFFF',                       // White text for dark backgrounds
      link: BRAND_COLORS.primary[700],          // Dark green for links
      disabled: BRAND_COLORS.neutral[400],      // Light gray for disabled text
    },

    // Utility colors
    border: BRAND_COLORS.neutral[200],
    divider: BRAND_COLORS.neutral[200],
    placeholder: BRAND_COLORS.neutral[400],
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
  },
};

// Export commonly used combinations
export const { colors, shadows } = Theme; 