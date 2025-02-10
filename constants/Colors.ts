/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#2E7D32',
    secondary: '#1B5E20',
    background: '#FFFFFF',
    accent: '#F5F5F5',
    text: '#11181C',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    info: '#1976D2',
    surface: '#FFFFFF',
    border: '#E0E0E0',
    placeholder: '#9E9E9E',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#4CAF50',
    secondary: '#2E7D32',
    background: '#121212',
    accent: '#242424',
    text: '#FFFFFF',
    error: '#EF5350',
    success: '#4CAF50',
    warning: '#FFA726',
    info: '#29B6F6',
    surface: '#1E1E1E',
    border: '#424242',
    placeholder: '#757575',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
