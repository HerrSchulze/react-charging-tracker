export const COLORS = {
  primary: '#1B7A7E',
  secondary: '#FF6B6B',
  tertiary: '#FFD93D',
  background: '#F0F4F5',
  surface: '#FFFFFF',
  error: '#E63946',
  text: '#1B3A3E',
  textSecondary: '#5A7A7E',
  border: '#D4E4E6',
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const PAGINATION = {
  itemsPerPage: 4,
};

export const DATE_FORMAT = 'dd.MM.yyyy';

export const VALIDATION_MESSAGES = {
  nameRequired: 'Name cannot be empty',
  initialCostsNegative: 'Initial costs cannot be negative',
  stationProviderRequired: 'Station provider cannot be empty',
  locationRequired: 'Location cannot be empty',
  energyChargedPositive: 'Energy charged must be positive',
  totalCostNegative: 'Total cost cannot be negative',
  dateInFuture: 'Date cannot be in the future',
  invalidDateFormat: 'Invalid date format',
};
