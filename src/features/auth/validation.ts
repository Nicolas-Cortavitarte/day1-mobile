const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_HELPER_TEXT = 'Al menos 8 caracteres, una letra y un número.';

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function validatePassword(password: string): string | null {
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return PASSWORD_HELPER_TEXT;
  }
  return null;
}
