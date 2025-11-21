import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { COLORS } from '../constants';

interface ErrorMessageProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  visible,
  onDismiss,
}) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={styles.snackbar}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: COLORS.error,
  },
});
