import { MD3LightTheme } from 'react-native-paper';
import { COLORS } from '../constants';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.tertiary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    onPrimary: COLORS.surface,
    onSecondary: COLORS.surface,
    onBackground: COLORS.text,
    onSurface: COLORS.text,
  },
};
