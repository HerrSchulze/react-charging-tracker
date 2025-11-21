import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  style?: any;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'plus',
  style,
}) => {
  return (
    <FAB
      icon={icon}
      onPress={onPress}
      style={[styles.fab, style]}
      color={COLORS.surface}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: SPACING.lg,
    right: 0,
    bottom: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
});
