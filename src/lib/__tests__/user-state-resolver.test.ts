import { describe, expect, it } from 'vitest';
import { resolveUserStateWithClient } from '../user-state';

function createEqChain(result: unknown) {
  return {
    eq() {
      return this;
    },
    maybeSingle: async () => result,
    limit: async () => result,
  };
}

describe('resolveUserStateWithClient', () => {
  it('throws instead of downgrading to needs_profile when the profile query fails', async () => {
    const db = {
      from(table: string) {
        if (table === 'profiles') {
          return {
            select() {
              return {
                eq() {
                  return {
                    maybeSingle: async () => ({
                      data: null,
                      error: new Error('profile query failed'),
                    }),
                  };
                },
              };
            },
          };
        }

        return {
          select() {
            return createEqChain({ data: null, error: null });
          },
        };
      },
    };

    await expect(resolveUserStateWithClient('user-1', db as never)).rejects.toThrow(
      'profile query failed',
    );
  });
});
