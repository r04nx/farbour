import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type StepIndicatorProps = {
  steps: string[];
  currentStep: number;
  style?: ViewStyle;
};

export function StepIndicator({ steps, currentStep, style }: StepIndicatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, style]}>
      {steps.map((step, index) => (
        <ThemedView key={step} style={styles.step}>
          <ThemedView style={styles.stepLine}>
            {index > 0 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor:
                      index <= currentStep ? colors.primary : colors.border,
                  },
                ]}
              />
            )}
            <ThemedView
              style={[
                styles.circle,
                {
                  backgroundColor:
                    index < currentStep
                      ? colors.primary
                      : index === currentStep
                      ? colors.background
                      : colors.border,
                  borderColor:
                    index <= currentStep ? colors.primary : colors.border,
                },
              ]}>
              {index < currentStep ? (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color="white"
                />
              ) : (
                <ThemedText
                  style={[
                    styles.stepNumber,
                    {
                      color:
                        index === currentStep ? colors.primary : colors.placeholder,
                    },
                  ]}>
                  {index + 1}
                </ThemedText>
              )}
            </ThemedView>
          </ThemedView>
          <ThemedText
            style={[
              styles.stepTitle,
              {
                color:
                  index <= currentStep ? colors.text : colors.placeholder,
                fontWeight: index === currentStep ? '600' : '400',
              },
            ]}>
            {step}
          </ThemedText>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  step: {
    flex: 1,
    alignItems: 'center',
  },
  stepLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
}); 