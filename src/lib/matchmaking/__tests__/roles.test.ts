import { describe, it, expect } from 'vitest';
import { getMacroRole, ROLE_TO_MACRO } from '../roles';
import { SPECIFIC_ROLES } from '@/lib/constants';

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
});
