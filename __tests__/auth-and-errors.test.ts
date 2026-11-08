import {
  isValidEmail,
  normalizeEmail,
  validatePassword,
} from '../src/features/auth/validation';
import { translateAuthError } from '../src/features/auth/authErrors';
import { ApiError, getErrorMessage } from '../src/lib/errors';

describe('validation', () => {
  it('normaliza el correo (trim + minúsculas)', () => {
    expect(normalizeEmail('  Alex@Correo.COM ')).toBe('alex@correo.com');
  });

  it('valida el formato del correo', () => {
    expect(isValidEmail('alex@correo.com')).toBe(true);
    expect(isValidEmail('  alex@correo.com  ')).toBe(true);
    expect(isValidEmail('alex@correo')).toBe(false);
    expect(isValidEmail('alex correo.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('exige 8 caracteres, una letra y un número en la contraseña', () => {
    expect(validatePassword('abc12345')).toBeNull();
    expect(validatePassword('corta1')).not.toBeNull();
    expect(validatePassword('soloLetrasAqui')).not.toBeNull();
    expect(validatePassword('1234567890')).not.toBeNull();
  });
});

describe('translateAuthError', () => {
  it('traduce por código de Supabase', () => {
    expect(translateAuthError({ message: 'x', code: 'invalid_credentials' })).toBe(
      'Correo o contraseña incorrectos.',
    );
  });

  it('traduce por mensaje cuando no hay código', () => {
    expect(translateAuthError({ message: 'Invalid login credentials' })).toBe(
      'Correo o contraseña incorrectos.',
    );
    expect(translateAuthError({ message: 'Email not confirmed' })).toContain('Confirma tu correo');
  });

  it('usa un mensaje genérico en español para errores desconocidos', () => {
    expect(translateAuthError({ message: 'something weird' })).toBe(
      'No pudimos completar la acción. Inténtalo de nuevo.',
    );
  });
});

describe('getErrorMessage', () => {
  it('devuelve el mensaje de un ApiError', () => {
    expect(getErrorMessage(new ApiError('Mensaje claro', 404), 'respaldo')).toBe('Mensaje claro');
  });

  it('no filtra errores técnicos: usa el respaldo', () => {
    expect(getErrorMessage(new TypeError('undefined is not a function'), 'respaldo')).toBe('respaldo');
    expect(getErrorMessage('cualquier cosa', 'respaldo')).toBe('respaldo');
  });
});
