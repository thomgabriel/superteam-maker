import { describe, it, expect } from 'vitest';
import { getMacroRole, ROLE_TO_MACRO } from '../roles';
import { SPECIFIC_ROLES } from '@/lib/constants';

describe('getMacroRole', () => {
  it('maps all specific roles to a macro role', () => {
    for (const role of SPECIFIC_ROLES) {
      expect(getMacroRole(role)).toBeDefined();
    }
  });

  it('returns engineering for developer roles', () => {
    expect(getMacroRole('Frontend Developer')).toBe('engineering');
    expect(getMacroRole('Backend Developer')).toBe('engineering');
    expect(getMacroRole('AI / ML Engineer')).toBe('engineering');
  });

  it('returns design for designer roles', () => {
    expect(getMacroRole('Product Designer')).toBe('design');
    expect(getMacroRole('Visual Designer')).toBe('design');
  });

  it('returns business_gtm for business roles', () => {
    expect(getMacroRole('Biz Dev')).toBe('business_gtm');
    expect(getMacroRole('Product Manager')).toBe('business_gtm');
    expect(getMacroRole('Marketer')).toBe('business_gtm');
  });

  it('throws for unknown role', () => {
    expect(() => getMacroRole('Unknown Role')).toThrow('Unknown role');
  });

  it('covers every role in SPECIFIC_ROLES', () => {
    const mapped = Object.keys(ROLE_TO_MACRO);
    for (const role of SPECIFIC_ROLES) {
      expect(mapped).toContain(role);
    }
  });
});
