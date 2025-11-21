import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, onPress }) => {
  return (
    <PaperCard style={styles.card} onPress={onPress}>
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
});
