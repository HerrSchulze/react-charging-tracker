import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  hasNextPage,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={onPrevious}
        disabled={currentPage === 0}
        style={styles.button}
      >
        Previous
      </Button>
      <Button
        mode="outlined"
        onPress={onNext}
        disabled={!hasNextPage}
        style={styles.button}
      >
        Next
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  button: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
});
