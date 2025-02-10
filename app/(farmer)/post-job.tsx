import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StepIndicator } from '@/components/StepIndicator';

type JobFormData = {
  title: string;
  description: string;
  location: string;
  wageAmount: string;
  wageType: 'per_day' | 'per_hour' | 'per_task';
  durationValue: string;
  durationType: 'hours' | 'days' | 'weeks';
  workersNeeded: string;
  skills: string[];
};

const INITIAL_FORM: JobFormData = {
  title: '',
  description: '',
  location: '',
  wageAmount: '',
  wageType: 'per_day',
  durationValue: '',
  durationType: 'days',
  workersNeeded: '',
  skills: [],
};

export default function PostJobScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const steps = [
    {
      title: 'Basic Details',
      fields: ['title', 'description', 'location'],
    },
    {
      title: 'Work Details',
      fields: ['wageAmount', 'wageType', 'durationValue', 'durationType'],
    },
    {
      title: 'Requirements',
      fields: ['workersNeeded', 'skills'],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Submit job posting
    console.log('Submitting job:', formData);
    router.push('/(farmer)/home');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animated.View entering={FadeIn} style={styles.stepContainer}>
            <Input
              placeholder="Job Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              leftIcon="briefcase-outline"
            />
            <Input
              placeholder="Job Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              leftIcon="text"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
            <Input
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              leftIcon="map-marker"
            />
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View entering={FadeIn} style={styles.stepContainer}>
            <ThemedView style={styles.row}>
              <Input
                placeholder="Wage Amount"
                value={formData.wageAmount}
                onChangeText={(text) => setFormData({ ...formData, wageAmount: text })}
                keyboardType="numeric"
                leftIcon="currency-inr"
                style={styles.flex1}
              />
              <Button
                title={formData.wageType === 'per_day' ? 'Per Day' : formData.wageType === 'per_hour' ? 'Per Hour' : 'Per Task'}
                onPress={() => {
                  const types = ['per_day', 'per_hour', 'per_task'];
                  const currentIndex = types.indexOf(formData.wageType);
                  const nextType = types[(currentIndex + 1) % types.length] as JobFormData['wageType'];
                  setFormData({ ...formData, wageType: nextType });
                }}
                variant="outline"
                style={styles.selectButton}
              />
            </ThemedView>

            <ThemedView style={styles.row}>
              <Input
                placeholder="Duration"
                value={formData.durationValue}
                onChangeText={(text) => setFormData({ ...formData, durationValue: text })}
                keyboardType="numeric"
                leftIcon="clock-outline"
                style={styles.flex1}
              />
              <Button
                title={formData.durationType === 'days' ? 'Days' : formData.durationType === 'hours' ? 'Hours' : 'Weeks'}
                onPress={() => {
                  const types = ['hours', 'days', 'weeks'];
                  const currentIndex = types.indexOf(formData.durationType);
                  const nextType = types[(currentIndex + 1) % types.length] as JobFormData['durationType'];
                  setFormData({ ...formData, durationType: nextType });
                }}
                variant="outline"
                style={styles.selectButton}
              />
            </ThemedView>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeIn} style={styles.stepContainer}>
            <Input
              placeholder="Number of Workers Needed"
              value={formData.workersNeeded}
              onChangeText={(text) => setFormData({ ...formData, workersNeeded: text })}
              keyboardType="numeric"
              leftIcon="account-group"
            />
            <Input
              placeholder="Required Skills (comma separated)"
              value={formData.skills.join(', ')}
              onChangeText={(text) => setFormData({ ...formData, skills: text.split(',').map(s => s.trim()) })}
              leftIcon="hammer-wrench"
            />
          </Animated.View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">Post a Job</ThemedText>
        
        <StepIndicator
          steps={steps.map(s => s.title)}
          currentStep={currentStep}
          style={styles.stepIndicator}
        />

        {renderStep()}
      </ScrollView>

      <ThemedView style={styles.footer}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.footerButton}
          />
        )}
        <Button
          title={currentStep === steps.length - 1 ? 'Post Job' : 'Next'}
          onPress={handleNext}
          style={[styles.footerButton, styles.flex1]}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  stepIndicator: {
    marginVertical: 24,
  },
  stepContainer: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  selectButton: {
    minWidth: 100,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  footerButton: {
    flex: 1,
  },
}); 