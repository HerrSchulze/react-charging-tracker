jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: '/mock/documents/',
  writeAsStringAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

jest.mock('date-fns', () => ({
  format: jest.fn((date, format) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }),
  parse: jest.fn((dateString, format, baseDate) => {
    const [day, month, year] = dateString.split('.');
    return new Date(year, month - 1, day);
  }),
  isValid: jest.fn((date) => date instanceof Date && !isNaN(date.getTime())),
}));
