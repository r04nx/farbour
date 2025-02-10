import { TextInput, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type InputProps = React.ComponentProps<typeof TextInput> & {
  leftIcon?: string;
  error?: string;
};

export function Input({ leftIcon, error, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View>
      <View 
        style={[
          styles.container,
          { 
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.surface,
          },
          style
        ]}
      >
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={colors.placeholder}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.text }
          ]}
          placeholderTextColor={colors.placeholder}
          {...props}
        />
      </View>
      {error && (
        <ThemedText style={[styles.error, { color: colors.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
}); 