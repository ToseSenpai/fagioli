/**
 * Generate a unique tracking code for a pratica
 * Format: FAG-XXXXXX (where X is alphanumeric)
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Excluded I, O, 0, 1 to avoid confusion

export function generateTrackingCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    code += ALPHABET[randomIndex];
  }
  return `FAG-${code}`;
}

/**
 * Validate tracking code format
 */
export function isValidTrackingCode(code: string): boolean {
  const pattern = /^FAG-[A-HJ-NP-Z2-9]{6}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Normalize tracking code (uppercase, trim)
 */
export function normalizeTrackingCode(code: string): string {
  return code.trim().toUpperCase();
}
