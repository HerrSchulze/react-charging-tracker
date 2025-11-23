import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING } from '../constants';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface EmptyStateProps {
  icon?: IconName;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  message,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color={COLORS.textSecondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
