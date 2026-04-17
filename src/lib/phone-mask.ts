/**
 * Format a phone number for safe display (masking middle digits).
 * Brazilian numbers (starting with +55) show country code + DDD.
 * Other formats fall back to last-4-digits masking.
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '—';

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '—';

  if (digits.startsWith('55') && digits.length >= 12) {
    const ddd = digits.slice(2, 4);
    const last4 = digits.slice(-4);
    return `+55 ${ddd} ****${last4}`;
  }

  return `****${digits.slice(-4)}`;
}
