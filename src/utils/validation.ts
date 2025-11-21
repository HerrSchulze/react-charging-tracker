import { VALIDATION_MESSAGES } from '../constants';

export const validateTravelEvent = (name: string, initialCosts: number): string | null => {
  if (!name || name.trim() === '') {
    return VALIDATION_MESSAGES.nameRequired;
  }
  if (initialCosts < 0) {
    return VALIDATION_MESSAGES.initialCostsNegative;
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
  if (!location || location.trim() === '') {
    return VALIDATION_MESSAGES.locationRequired;
  }
  if (energyCharged <= 0) {
    return VALIDATION_MESSAGES.energyChargedPositive;
  }
  if (totalCost < 0) {
    return VALIDATION_MESSAGES.totalCostNegative;
  }
  return null;
};
