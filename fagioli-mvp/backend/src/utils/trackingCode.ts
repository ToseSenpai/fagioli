/**
 * Generate a 6-character alphanumeric tracking code
 * Format: ABC123 (uppercase letters and numbers)
 */
export function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  return code;
}

/**
 * Validate tracking code format
 */
export function isValidTrackingCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
