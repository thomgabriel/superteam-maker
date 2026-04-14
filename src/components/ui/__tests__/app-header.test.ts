import { describe, expect, it } from 'vitest';

import { getStatusLinks } from '@/components/ui/app-header';

describe('getStatusLinks', () => {
  it('shows requeue and profile links for users in needs_requeue state', () => {
    const links = getStatusLinks({
      teamId: null,
      statusPath: '/requeue',
      showProfileLink: false,
      pathname: '/requeue',
    });

    expect(links).toEqual([
      {
        href: '/requeue',
        label: 'Recomeçar',
        active: true,
      },
      {
        href: '/profile',
        label: 'Perfil',
        active: false,
      },
    ]);
  });
});
