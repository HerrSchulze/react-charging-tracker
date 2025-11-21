import { formatDate, parseDate, isDateInFuture } from './dateUtils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format timestamp to dd.MM.yyyy', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('15.01.2024');
    });

    it('should handle different dates', () => {
      const timestamp = new Date('2024-12-25').getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('25.12.2024');
    });
  });

  describe('parseDate', () => {
    it('should parse dd.MM.yyyy format', () => {
      const result = parseDate('15.01.2024');
      expect(result).not.toBeNull();
      const date = new Date(result!);
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0);
      expect(date.getFullYear()).toBe(2024);
    });

    it('should return null for invalid format', () => {
      const result = parseDate('2024-01-15');
      expect(result).toBeNull();
    });

    it('should return null for invalid date', () => {
      const result = parseDate('32.13.2024');
      expect(result).toBeNull();
    });
  });

  describe('isDateInFuture', () => {
    it('should return true for future date', () => {
      const futureDate = Date.now() + 86400000;
      const result = isDateInFuture(futureDate);
      expect(result).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = Date.now() - 86400000;
      const result = isDateInFuture(pastDate);
      expect(result).toBe(false);
    });

    it('should return false for current date', () => {
      const result = isDateInFuture(Date.now());
      expect(result).toBe(false);
    });
  });
});
