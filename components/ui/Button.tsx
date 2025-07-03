import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { SPACING, TYPOGRAPHY } from '@/constants/Theme';
import React from 'react';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  loading,
  disabled,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.text.disabled;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.inverse;
    switch (variant) {
      case 'outline':
        return colors.text.link;
      default:
        return colors.text.inverse;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? colors.text.link : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon && (
            typeof leftIcon === 'string' ? (
              <MaterialCommunityIcons
                name={leftIcon}
                size={20}
                color={getTextColor()}
                style={styles.leftIcon}
              />
            ) : (
              <React.Fragment>
                {leftIcon}
              </React.Fragment>
            )
          )}
          <ThemedText
            style={[
              styles.text,
              styles[`${size}Text`],
              { color: getTextColor() },
            ]}
          >
            {title}
          </ThemedText>
          {rightIcon && (
            typeof rightIcon === 'string' ? (
              <MaterialCommunityIcons
                name={rightIcon}
                size={20}
                color={getTextColor()}
                style={styles.rightIcon}
              />
            ) : (
              <React.Fragment>
                {rightIcon}
              </React.Fragment>
            )
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  text: {
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  smallText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  largeText: {
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  leftIcon: {
    marginRight: SPACING.xs,
  },
  rightIcon: {
    marginLeft: SPACING.xs,
  },
}); 