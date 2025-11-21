import { calculateCostPerKwh, roundToTwoDecimals } from './calculations';

describe('Calculation Utils', () => {
  describe('calculateCostPerKwh', () => {
    it('should return 0 for zero energy', () => {
      const result = calculateCostPerKwh(100, 0);
      expect(result).toBe(0);
    });

    it('should calculate cost per kWh correctly', () => {
      const result = calculateCostPerKwh(50, 10);
      expect(result).toBe(5);
    });

    it('should round to 2 decimal places', () => {
      const result = calculateCostPerKwh(33.33, 10);
      expect(result).toBe(3.33);
    });

    it('should handle decimal values', () => {
      const result = calculateCostPerKwh(25.5, 5);
      expect(result).toBe(5.1);
    });
  });

  describe('roundToTwoDecimals', () => {
    it('should round to 2 decimal places', () => {
      const result = roundToTwoDecimals(10.456);
      expect(result).toBe(10.46);
    });

    it('should handle exact 2 decimal values', () => {
      const result = roundToTwoDecimals(10.50);
      expect(result).toBe(10.5);
    });

    it('should handle integers', () => {
      const result = roundToTwoDecimals(10);
      expect(result).toBe(10);
    });

    it('should handle very small values', () => {
      const result = roundToTwoDecimals(0.001);
      expect(result).toBe(0);
    });
  });
});
