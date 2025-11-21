import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
}) => {
  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
      error={!!error}
      style={styles.input}
      outlineColor={COLORS.border}
      activeOutlineColor={COLORS.primary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
});
