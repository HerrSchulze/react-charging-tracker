import { format, parse, isValid } from 'date-fns';
import { DATE_FORMAT } from '../constants';

export const formatDate = (timestamp: number | string): string => {
  try {
    const num = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(num)) return 'Invalid date';
    return format(new Date(num), DATE_FORMAT);
  } catch {
    return 'Invalid date';
  }
};

export const parseDate = (dateString: string): number | null => {
  try {
    const parsed = parse(dateString, DATE_FORMAT, new Date());
    if (!isValid(parsed)) return null;
    return parsed.getTime();
  } catch {
    return null;
  }
};

export const isDateInFuture = (timestamp: number): boolean => {
  return timestamp > Date.now();
};
