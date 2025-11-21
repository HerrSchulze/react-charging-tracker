import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface FormButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
}) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={styles.button}
      buttonColor={COLORS.primary}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.md,
  },
});
