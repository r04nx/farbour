import { Text, TextProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TYPOGRAPHY } from '@/constants/Theme';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body' | 'caption';
  variant?: 'primary' | 'secondary' | 'inverse';
}

export function ThemedText({ 
  style, 
  type = 'body',
  variant = 'primary',
  ...props 
}: ThemedTextProps) {
  const { colors } = useTheme();

  const textStyles = {
    color: variant === 'primary' 
      ? colors.text.primary 
      : variant === 'secondary'
      ? colors.text.secondary
      : colors.text.inverse,
    fontSize: type === 'title' 
      ? TYPOGRAPHY.sizes.xxl 
      : type === 'subtitle'
      ? TYPOGRAPHY.sizes.xl
      : type === 'caption'
      ? TYPOGRAPHY.sizes.sm
      : TYPOGRAPHY.sizes.md,
    fontWeight: type === 'title' 
      ? TYPOGRAPHY.weights.bold
      : type === 'subtitle'
      ? TYPOGRAPHY.weights.semibold
      : TYPOGRAPHY.weights.regular,
  };

  return (
    <Text
      style={[textStyles, style]}
      {...props}
    />
  );
}
