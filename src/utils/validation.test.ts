import { validateTravelEvent, validateChargingSession } from './validation';

describe('Validation Utils', () => {
  describe('validateTravelEvent', () => {
    it('should return error for empty name', () => {
      const result = validateTravelEvent('', 0);
      expect(result).toBe('Name cannot be empty');
    });

    it('should return error for negative initial costs', () => {
      const result = validateTravelEvent('Event', -10);
      expect(result).toBe('Initial costs cannot be negative');
    });

    it('should return null for valid event', () => {
      const result = validateTravelEvent('Event', 50);
      expect(result).toBeNull();
    });
  });

  describe('validateChargingSession', () => {
    const futureDate = Date.now() + 86400000;
    const pastDate = Date.now() - 86400000;

    it('should return error for future date', () => {
      const result = validateChargingSession(futureDate, 'Provider', 'Location', 10, 50);
      expect(result).toBe('Date cannot be in the future');
    });

    it('should return error for empty station provider', () => {
      const result = validateChargingSession(pastDate, '', 'Location', 10, 50);
      expect(result).toBe('Station provider cannot be empty');
    });

    it('should return error for empty location', () => {
      const result = validateChargingSession(pastDate, 'Provider', '', 10, 50);
      expect(result).toBe('Location cannot be empty');
    });

    it('should return error for zero or negative energy', () => {
      const result = validateChargingSession(pastDate, 'Provider', 'Location', 0, 50);
      expect(result).toBe('Energy charged must be positive');
    });

    it('should return error for negative cost', () => {
      const result = validateChargingSession(pastDate, 'Provider', 'Location', 10, -5);
      expect(result).toBe('Total cost cannot be negative');
    });

    it('should return null for valid session', () => {
      const result = validateChargingSession(pastDate, 'Provider', 'Location', 10, 50);
      expect(result).toBeNull();
    });
  });
});
