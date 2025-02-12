import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SPACING, TYPOGRAPHY, BRAND_COLORS } from '@/constants/Theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    location: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      name: formData.name,
      phone: formData.phone,
    });
    setLoading(false);
    if (!error) {
      setIsEditing(false);
    }
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
        <ThemedView style={styles.header}>
          <ThemedView style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color={BRAND_COLORS.primary[400]}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialCommunityIcons
                name="camera"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </ThemedView>
          <ThemedText style={styles.name}>{profile?.name}</ThemedText>
          <ThemedView style={styles.badgeContainer}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color={BRAND_COLORS.primary[400]}
            />
            <ThemedText style={styles.badgeText}>Verified Farmer</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <MaterialCommunityIcons
                name={isEditing ? "close" : "pencil"}
                size={20}
                color={BRAND_COLORS.primary[400]}
              />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.form}>
            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Name</ThemedText>
              <Input
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                editable={isEditing}
                leftIcon="account"
              />
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Phone</ThemedText>
              <Input
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                editable={isEditing}
                leftIcon="phone"
                keyboardType="phone-pad"
              />
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Location</ThemedText>
              <Input
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                editable={isEditing}
                leftIcon="map-marker"
                placeholder="Enter your location"
              />
            </ThemedView>

            <ThemedView style={styles.formGroup}>
              <ThemedText style={styles.label}>Bio</ThemedText>
              <Input
                value={formData.bio}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                editable={isEditing}
                leftIcon="text"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Tell us about yourself"
              />
            </ThemedView>

            {isEditing && (
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
            )}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Stats</ThemedText>
          <ThemedView style={styles.statsContainer}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Total Jobs</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>156</ThemedText>
              <ThemedText style={styles.statLabel}>Workers Hired</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statDivider} />
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>4.8</ThemedText>
              <ThemedText style={styles.statLabel}>Rating</ThemedText>
            </ThemedView>
          </ThemedView>
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
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  editAvatarButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: BRAND_COLORS.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BRAND_COLORS.neutral[900],
  },
  name: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: SPACING.xs,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.primary[400],
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '600',
    color: '#fff',
  },
  editButton: {
    padding: SPACING.xs,
  },
  form: {
    gap: SPACING.md,
  },
  formGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
  saveButton: {
    marginTop: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: SPACING.md,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: BRAND_COLORS.neutral[400],
  },
}); 