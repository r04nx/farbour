import { useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Button } from './ui/Button';
import { colors, SPACING } from '@/constants/Theme';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    region: string;
    distance: number;
    minWage: number;
    rating: number;
    urgent: boolean;
  };
  onApply: (filters: FilterSheetProps['filters']) => void;
}

export function FilterSheet({ visible, onClose, filters, onApply }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const handleApply = () => {
    onApply(localFilters);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          entering={SlideInDown}
          style={styles.sheet}
        >
          <TouchableOpacity activeOpacity={1}>
            <ScrollView style={styles.content}>
              {/* Header */}
              <ThemedView style={styles.header}>
                <ThemedText type="subtitle">Filters</ThemedText>
                <TouchableOpacity onPress={onClose}>
                  <MaterialCommunityIcons 
                    name="close" 
                    size={24} 
                    color={colors.text.secondary} 
                  />
                </TouchableOpacity>
              </ThemedView>

              {/* Region Filter */}
              <ThemedView style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Region</ThemedText>
                <ThemedView style={styles.inputContainer}>
                  <MaterialCommunityIcons 
                    name="map-marker" 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter region or district"
                    value={localFilters.region}
                    onChangeText={(text) => 
                      setLocalFilters({ ...localFilters, region: text })
                    }
                    placeholderTextColor={colors.text.secondary}
                  />
                </ThemedView>
              </ThemedView>

              {/* Distance Filter */}
              <ThemedView style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Distance</ThemedText>
                <ThemedText style={styles.filterValue}>
                  Within {localFilters.distance} km
                </ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={localFilters.distance}
                  onValueChange={(value) => 
                    setLocalFilters({ ...localFilters, distance: value })
                  }
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceVariant}
                  thumbTintColor={colors.primary}
                />
              </ThemedView>

              {/* Minimum Wage Filter */}
              <ThemedView style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Minimum Wage</ThemedText>
                <ThemedText style={styles.filterValue}>
                  ₹{localFilters.minWage}/day
                </ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={100}
                  maximumValue={1000}
                  step={50}
                  value={localFilters.minWage}
                  onValueChange={(value) => 
                    setLocalFilters({ ...localFilters, minWage: value })
                  }
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.surfaceVariant}
                  thumbTintColor={colors.primary}
                />
              </ThemedView>

              {/* Rating Filter */}
              <ThemedView style={styles.filterSection}>
                <ThemedText style={styles.filterLabel}>Minimum Rating</ThemedText>
                <ThemedView style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => 
                        setLocalFilters({ ...localFilters, rating })
                      }
                    >
                      <MaterialCommunityIcons
                        name={rating <= localFilters.rating ? "star" : "star-outline"}
                        size={32}
                        color={rating <= localFilters.rating ? colors.warning : colors.text.disabled}
                      />
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              </ThemedView>

              {/* Urgent Filter */}
              <TouchableOpacity
                style={styles.urgentFilter}
                onPress={() => 
                  setLocalFilters({ 
                    ...localFilters, 
                    urgent: !localFilters.urgent 
                  })
                }
              >
                <ThemedText>Show Urgent Jobs Only</ThemedText>
                <MaterialCommunityIcons
                  name={localFilters.urgent ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={24}
                  color={localFilters.urgent ? colors.primary : colors.text.secondary}
                />
              </TouchableOpacity>

              {/* Apply Button */}
              <Button
                title="Apply Filters"
                onPress={handleApply}
                style={styles.applyButton}
              />
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: SPACING.xs,
  },
  filterValue: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: SPACING.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  urgentFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.xl,
  },
  applyButton: {
    marginTop: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: SPACING.xs,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 16,
    color: colors.text.primary,
  },
}); 