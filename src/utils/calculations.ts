export const calculateCostPerKwh = (totalCost: number, energyCharged: number): number => {
  if (energyCharged === 0) return 0;
  return Math.round((totalCost / energyCharged) * 100) / 100;
};

export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
