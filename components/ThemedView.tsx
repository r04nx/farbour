import { View, ViewProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  variant?: 'primary' | 'surface' | 'transparent';
}

export function ThemedView({ style, variant = 'transparent', ...props }: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColor = variant === 'primary' 
    ? colors.primary 
    : variant === 'surface' 
    ? colors.surface 
    : undefined;

  return (
    <View
      style={[
        { backgroundColor },
        style,
      ]}
      {...props}
    />
  );
}
