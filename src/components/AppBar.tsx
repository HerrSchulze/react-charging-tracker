import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING } from '../constants';

interface AppBarProps {
  title: string;
  onBack?: () => void;
  onAction?: () => void;
  actionIcon?: string;
}

export const AppBar: React.FC<AppBarProps> = ({ title, onBack, onAction, actionIcon }) => {
  return (
    <Appbar.Header style={styles.header}>
      {onBack && (
        <Appbar.BackAction onPress={onBack} />
      )}
      <Appbar.Content title={title} />
      {onAction && actionIcon && (
        <TouchableOpacity onPress={onAction} style={styles.actionButton}>
          <MaterialCommunityIcons name={actionIcon} size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.surface,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
  },
});
