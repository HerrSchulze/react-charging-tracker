import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  cardContent: {
    padding: SPACING.md,
  },
  section: {
    marginVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  button: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  input: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
});
