import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

type JobFormData = {
  title: string;
  description: string;
  location: string;
  wagePerDay: string;
  workersNeeded: string;
  startDate: string;
  endDate: string;
  skills: string[];
};

const INITIAL_FORM_DATA: JobFormData = {
  title: '',
  description: '',
  location: '',
  wagePerDay: '',
  workersNeeded: '',
  startDate: '',
  endDate: '',
  skills: [],
};

const COMMON_SKILLS = [
  'Harvesting',
  'Planting',
  'Irrigation',
  'Machinery Operation',
  'Crop Management',
  'Pest Control',
];

export default function PostJobScreen() {
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [customSkill, setCustomSkill] = useState('');

  const validateForm = () => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.wagePerDay.trim() || isNaN(Number(formData.wagePerDay))) {
      newErrors.wagePerDay = 'Valid wage per day is required';
    }
    if (!formData.workersNeeded.trim() || isNaN(Number(formData.workersNeeded))) {
      newErrors.workersNeeded = 'Valid number of workers is required';
    }
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // TODO: Implement job posting logic
      console.log('Posting job:', formData);
      router.push('/(farmer)/home');
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: undefined }));
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      if (!formData.skills.includes(customSkill.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, customSkill.trim()]
        }));
        if (errors.skills) {
          setErrors(prev => ({ ...prev, skills: undefined }));
        }
      }
      setCustomSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

        return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.content}
      >
        <ThemedText style={styles.title}>Post a New Job</ThemedText>
        <ThemedText style={styles.subtitle}>
          Fill in the details below to create a new job listing
        </ThemedText>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Job Title</ThemedText>
            <Input
              placeholder="Enter job title"
              value={formData.title}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, title: text }));
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
              }}
              error={errors.title}
              leftIcon="briefcase"
            />
          </ThemedView>

          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <Input
              placeholder="Enter job description"
              value={formData.description}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, description: text }));
                if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
              }}
              error={errors.description}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              leftIcon="text"
            />
          </ThemedView>

          <ThemedView style={styles.formRow}>
            <ThemedView style={[styles.formGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>Daily Wage (₹)</ThemedText>
              <Input
                placeholder="Enter wage per day"
                value={formData.wagePerDay}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, wagePerDay: text }));
                  if (errors.wagePerDay) setErrors(prev => ({ ...prev, wagePerDay: undefined }));
                }}
                error={errors.wagePerDay}
                keyboardType="numeric"
                leftIcon="currency-inr"
              />
            </ThemedView>

            <ThemedView style={[styles.formGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>Workers Needed</ThemedText>
              <Input
                placeholder="Number of workers"
                value={formData.workersNeeded}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, workersNeeded: text }));
                  if (errors.workersNeeded) setErrors(prev => ({ ...prev, workersNeeded: undefined }));
                }}
                error={errors.workersNeeded}
                keyboardType="numeric"
                leftIcon="account-group"
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <Input
              placeholder="Enter job location"
              value={formData.location}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, location: text }));
                if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
              }}
              error={errors.location}
              leftIcon="map-marker"
            />
          </ThemedView>

          <ThemedView style={styles.formRow}>
            <ThemedView style={[styles.formGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>Start Date</ThemedText>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, startDate: text }));
                  if (errors.startDate) setErrors(prev => ({ ...prev, startDate: undefined }));
                }}
                error={errors.startDate}
                leftIcon="calendar"
              />
            </ThemedView>

            <ThemedView style={[styles.formGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>End Date</ThemedText>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.endDate}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, endDate: text }));
                  if (errors.endDate) setErrors(prev => ({ ...prev, endDate: undefined }));
                }}
                error={errors.endDate}
                leftIcon="calendar"
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.formGroup}>
            <ThemedText style={styles.label}>Required Skills</ThemedText>

            {/* Custom Skill Input */}
            <ThemedView style={styles.customSkillInput}>
              <Input
                placeholder="Type a custom skill and press Enter"
                value={customSkill}
                onChangeText={setCustomSkill}
                onSubmitEditing={addCustomSkill}
                returnKeyType="done"
                leftIcon="plus-circle"
              />
            </ThemedView>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <ThemedView style={styles.selectedSkillsContainer}>
                {formData.skills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={styles.selectedSkillChip}
                    onPress={() => removeSkill(skill)}
                  >
                    <ThemedText style={styles.selectedSkillText}>
                      {skill}
                    </ThemedText>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={16}
                      color="#fff"
                    />
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}

            {/* Common Skills */}
            <ThemedText style={styles.commonSkillsLabel}>
              Or select from common skills:
            </ThemedText>
            <ThemedView style={styles.skillsContainer}>
              {COMMON_SKILLS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    formData.skills.includes(skill) && styles.skillChipSelected
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <MaterialCommunityIcons
                    name={formData.skills.includes(skill) ? 'check-circle' : 'circle-outline'}
                    size={20}
                    color={formData.skills.includes(skill) ? '#fff' : BRAND_COLORS.neutral[400]}
                  />
                  <ThemedText
                    style={[
                      styles.skillText,
                      formData.skills.includes(skill) && styles.skillTextSelected
                    ]}
                  >
                    {skill}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
            {errors.skills && (
              <ThemedText style={styles.errorText}>{errors.skills}</ThemedText>
            )}
          </ThemedView>

          <Button
            title="Post Job"
            onPress={handleSubmit}
            leftIcon="plus-circle"
            style={styles.submitButton}
        />
      </ThemedView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.neutral[900],
  },
  content: {
    padding: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.md,
  },
  form: {
    gap: SPACING.md,
  },
  formGroup: {
    gap: SPACING.xs,
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: IS_MOBILE ? 'wrap' : 'nowrap',
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral[700],
  },
  skillChipSelected: {
    backgroundColor: BRAND_COLORS.primary[500],
    borderColor: BRAND_COLORS.primary[500],
  },
  skillText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  skillTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: BRAND_COLORS.accent[500],
    marginTop: 2,
  },
  submitButton: {
    marginTop: SPACING.sm,
    height: 45,
  },
  customSkillInput: {
    marginBottom: SPACING.sm,
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral[800],
  },
  selectedSkillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: 16,
    backgroundColor: BRAND_COLORS.primary[500],
  },
  selectedSkillText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#fff',
    fontWeight: '500',
  },
  commonSkillsLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
}); 