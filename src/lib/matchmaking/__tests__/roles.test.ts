import { describe, it, expect } from 'vitest';
import { getMacroRole, ROLE_TO_MACRO, getFlexMacroRoles } from '../roles';
import { SPECIFIC_ROLES, SECONDARY_ROLES } from '@/lib/constants';

describe('getMacroRole', () => {
  it('maps all specific roles to a macro role', () => {
    for (const role of SPECIFIC_ROLES) {
      expect(getMacroRole(role)).toBeDefined();
    }
  });

  it('returns engineering for tech roles', () => {
    expect(getMacroRole('Desenvolvedor(a) de Software')).toBe('engineering');
    expect(getMacroRole('Cientista de Dados / IA')).toBe('engineering');
    expect(getMacroRole('Analista de Sistemas')).toBe('engineering');
  });

  it('returns design for designer roles', () => {
    expect(getMacroRole('Designer de Produto')).toBe('design');
    expect(getMacroRole('Designer Visual / Brand')).toBe('design');
  });

  it('returns business_gtm for business/domain roles', () => {
    expect(getMacroRole('Advogado(a) / Direito')).toBe('business_gtm');
    expect(getMacroRole('Product Manager')).toBe('business_gtm');
    expect(getMacroRole('Médico(a) / Saúde')).toBe('business_gtm');
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

  it('covers every role in SECONDARY_ROLES', () => {
    const mapped = Object.keys(ROLE_TO_MACRO);
    for (const role of SECONDARY_ROLES) {
      expect(mapped).toContain(role);
    }
  });
});

describe('getFlexMacroRoles', () => {
  it('returns macro roles from secondary roles excluding primary macro', () => {
    const result = getFlexMacroRoles(
      'Advogado(a) / Direito',
      ['Desenvolvedor(a) de Software', 'Marketing / Comunicação'],
    );
    expect(result).toEqual(['engineering']);
  });

  it('returns empty array when no secondary roles', () => {
    const result = getFlexMacroRoles('Advogado(a) / Direito', []);
    expect(result).toEqual([]);
  });

  it('returns empty array when all secondaries share primary macro', () => {
    const result = getFlexMacroRoles(
      'Advogado(a) / Direito',
      ['Product Manager', 'Marketing / Growth'],
    );
    expect(result).toEqual([]);
  });

  it('deduplicates macro roles', () => {
    const result = getFlexMacroRoles(
      'Advogado(a) / Direito',
      ['Desenvolvedor(a) de Software', 'Cientista de Dados / IA'],
    );
    expect(result).toEqual(['engineering']);
  });

  it('returns multiple flex macros when secondaries span categories', () => {
    const result = getFlexMacroRoles(
      'Advogado(a) / Direito',
      ['Desenvolvedor(a) de Software', 'Designer de Produto'],
    );
    expect(result).toContain('engineering');
    expect(result).toContain('design');
    expect(result).toHaveLength(2);
  });

  it('handles unknown secondary roles gracefully', () => {
    const result = getFlexMacroRoles(
      'Advogado(a) / Direito',
      ['Unknown Role', 'Desenvolvedor(a) de Software'],
    );
    expect(result).toEqual(['engineering']);
  });
});
