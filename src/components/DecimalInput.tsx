import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface DecimalInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const DecimalInput: React.FC<DecimalInputProps> = ({
  label,
  value,
  onChangeText,
  error,
}) => {
  const handleChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, '');
    onChangeText(filtered);
  };

  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={handleChange}
      mode="outlined"
      keyboardType="decimal-pad"
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
