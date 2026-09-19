import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  getStatusLabel,
  getDummyDistance,
} from './utils';

describe('formatCurrency', () => {
  it('formats a whole number as Indonesian Rupiah with no decimals', () => {
    expect(formatCurrency(50000)).toBe('Rp50.000');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('Rp0');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string into Indonesian long date + time', () => {
    const result = formatDate('2026-09-18T15:53:00.000Z');
    expect(result).toMatch(/^\d{1,2} \w+ \d{4}, \d{2}\.\d{2}$/);
  });
});

describe('formatDistance', () => {
  it('renders sub-kilometer distances in meters', () => {
    expect(formatDistance(0.45)).toBe('450 m');
  });

  it('renders distances of 1km or more in kilometers with one decimal', () => {
    expect(formatDistance(4.7)).toBe('4.7 km');
  });

  it('treats exactly 1km as kilometers, not meters', () => {
    expect(formatDistance(1)).toBe('1.0 km');
  });
});

describe('getStatusLabel', () => {
  it('maps known order statuses to their display label', () => {
    expect(getStatusLabel('on_the_way')).toBe('On the Way');
    expect(getStatusLabel('cancelled')).toBe('Cancelled');
  });

  it('falls back to the raw value for an unknown status', () => {
    expect(getStatusLabel('something_new')).toBe('something_new');
  });
});

describe('getDummyDistance', () => {
  it('is deterministic for the same restaurant id', () => {
    expect(getDummyDistance('42')).toBe(getDummyDistance('42'));
    expect(getDummyDistance(42)).toBe(getDummyDistance('42'));
  });

  it('always returns a value between 0.5 and 5.0 km', () => {
    for (const id of [0, 1, 7, 42, 999, '123']) {
      const distance = getDummyDistance(id);
      expect(distance).toBeGreaterThanOrEqual(0.5);
      expect(distance).toBeLessThanOrEqual(5.0);
    }
  });

  it('falls back to 0 for a non-numeric id instead of throwing', () => {
    expect(() => getDummyDistance('not-a-number')).not.toThrow();
  });
});
