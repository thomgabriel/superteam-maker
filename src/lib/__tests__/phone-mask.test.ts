import { describe, expect, it } from 'vitest';

import { maskPhoneNumber } from '../phone-mask';

describe('maskPhoneNumber', () => {
  it('masks Brazilian numbers with a +55 country code', () => {
    expect(maskPhoneNumber('+55 11 99999-9999')).toBe('+55 11 ****9999');
    expect(maskPhoneNumber('5511999999999')).toBe('+55 11 ****9999');
  });

  it('falls back to last-4 masking for Brazilian numbers without country code', () => {
    expect(maskPhoneNumber('11999999999')).toBe('****9999');
    expect(maskPhoneNumber('1199999999')).toBe('****9999');
  });

  it('masks non-Brazilian numbers to the last 4 digits', () => {
    expect(maskPhoneNumber('+1 415 555 0100')).toBe('****0100');
    expect(maskPhoneNumber('+44 20 7946 0958')).toBe('****0958');
  });

  it('returns an em-dash when input is null, undefined, or empty', () => {
    expect(maskPhoneNumber(null)).toBe('—');
    expect(maskPhoneNumber(undefined)).toBe('—');
    expect(maskPhoneNumber('')).toBe('—');
  });

  it('returns an em-dash when fewer than 4 digits are present', () => {
    expect(maskPhoneNumber('123')).toBe('—');
    expect(maskPhoneNumber('ab-cd')).toBe('—');
    expect(maskPhoneNumber('+55')).toBe('—');
  });

  it('handles mixed formatting (spaces, dashes, parens) via digit-strip', () => {
    expect(maskPhoneNumber('(11) 99999-9999')).toBe('****9999');
    expect(maskPhoneNumber('+55 (11) 9 9999-9999')).toBe('+55 11 ****9999');
    expect(maskPhoneNumber('55  11   9  9999   9999')).toBe('+55 11 ****9999');
  });
});
