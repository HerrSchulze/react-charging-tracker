import { VALIDATION_MESSAGES } from '../constants';

export const validateTravelEvent = (name: string, initialCosts: number): string | null => {
  if (!name || name.trim() === '') {
    return VALIDATION_MESSAGES.nameRequired;
  }
  if (name.length > 255) {
    return 'Name must be less than 255 characters';
  }
  if (initialCosts < 0) {
    return VALIDATION_MESSAGES.initialCostsNegative;
  }
  if (initialCosts > 999999) {
    return 'Initial costs cannot exceed 999999';
  }
  return null;
};

export const validateChargingSession = (
  date: number,
  stationProvider: string,
  location: string,
  energyCharged: number,
  totalCost: number
): string | null => {
  if (date > Date.now()) {
    return VALIDATION_MESSAGES.dateInFuture;
  }
  if (!stationProvider || stationProvider.trim() === '') {
    return VALIDATION_MESSAGES.stationProviderRequired;
  }
  if (stationProvider.length > 255) {
    return 'Station provider must be less than 255 characters';
  }
  if (!location || location.trim() === '') {
    return VALIDATION_MESSAGES.locationRequired;
  }
  if (location.length > 255) {
    return 'Location must be less than 255 characters';
  }
  if (energyCharged <= 0) {
    return VALIDATION_MESSAGES.energyChargedPositive;
  }
  if (energyCharged > 999999) {
    return 'Energy charged cannot exceed 999999';
  }
  if (totalCost < 0) {
    return VALIDATION_MESSAGES.totalCostNegative;
  }
  if (totalCost > 999999) {
    return 'Total cost cannot exceed 999999';
  }
  return null;
};
