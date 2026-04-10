import { describe, it, expect } from 'vitest';
import { getMacroRole, ROLE_TO_MACRO, getFlexMacroRoles } from '../roles';
import { SPECIFIC_ROLES } from '@/lib/constants';

describe('getMacroRole', () => {
  it('maps all specific roles to a macro role', () => {
    for (const role of SPECIFIC_ROLES) {
      expect(getMacroRole(role)).toBeDefined();
    }
  });

  it('returns engineering for tech roles', () => {
    expect(getMacroRole('Desenvolvimento de Software')).toBe('engineering');
    expect(getMacroRole('Dados / IA')).toBe('engineering');
  });

  it('returns design for design role', () => {
    expect(getMacroRole('Design / UX')).toBe('design');
  });

  it('returns business_gtm for business roles', () => {
    expect(getMacroRole('Pesquisa / Validação')).toBe('business_gtm');
    expect(getMacroRole('Produto / Estratégia')).toBe('business_gtm');
    expect(getMacroRole('Marketing / Growth')).toBe('business_gtm');
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

describe('getFlexMacroRoles', () => {
  it('returns macro roles from secondary roles excluding primary macro', () => {
    const result = getFlexMacroRoles(
      'Pesquisa / Validação',
      ['Desenvolvimento de Software', 'Marketing / Growth'],
    );
    expect(result).toEqual(['engineering']);
  });

  it('returns empty array when no secondary roles', () => {
    const result = getFlexMacroRoles('Pesquisa / Validação', []);
    expect(result).toEqual([]);
  });

  it('returns empty array when all secondaries share primary macro', () => {
    const result = getFlexMacroRoles(
      'Pesquisa / Validação',
      ['Produto / Estratégia', 'Marketing / Growth'],
    );
    expect(result).toEqual([]);
  });

  it('deduplicates macro roles', () => {
    const result = getFlexMacroRoles(
      'Pesquisa / Validação',
      ['Desenvolvimento de Software', 'Dados / IA'],
    );
    expect(result).toEqual(['engineering']);
  });

  it('returns multiple flex macros when secondaries span categories', () => {
    const result = getFlexMacroRoles(
      'Pesquisa / Validação',
      ['Desenvolvimento de Software', 'Design / UX'],
    );
    expect(result).toContain('engineering');
    expect(result).toContain('design');
    expect(result).toHaveLength(2);
  });

  it('handles unknown secondary roles gracefully', () => {
    const result = getFlexMacroRoles(
      'Pesquisa / Validação',
      ['Unknown Role', 'Desenvolvimento de Software'],
    );
    expect(result).toEqual(['engineering']);
  });
});
