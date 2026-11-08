type AuthErrorLike = { message: string; code?: string };

const CODE_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  email_not_confirmed: 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.',
  user_already_exists: 'Ya existe una cuenta con ese correo.',
  email_exists: 'Ya existe una cuenta con ese correo.',
  weak_password: 'La contraseña es muy débil. Usa al menos 8 caracteres, una letra y un número.',
  same_password: 'La nueva contraseña debe ser distinta a la anterior.',
  over_request_rate_limit: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  over_email_send_rate_limit: 'Ya enviamos varios correos. Espera unos minutos e inténtalo de nuevo.',
  otp_expired: 'El enlace expiró. Solicita uno nuevo.',
};

export function translateAuthError(error: AuthErrorLike): string {
  if (error.code && CODE_MESSAGES[error.code]) return CODE_MESSAGES[error.code];

  const message = error.message.toLowerCase();
  if (message.includes('invalid login credentials')) return CODE_MESSAGES.invalid_credentials;
  if (message.includes('email not confirmed')) return CODE_MESSAGES.email_not_confirmed;
  if (message.includes('already registered')) return CODE_MESSAGES.user_already_exists;
  if (message.includes('rate limit') || message.includes('too many')) return CODE_MESSAGES.over_request_rate_limit;
  if (message.includes('different from the old')) return CODE_MESSAGES.same_password;
  if (message.includes('expired')) return CODE_MESSAGES.otp_expired;
  if (message.includes('network') || message.includes('fetch')) {
    return 'No pudimos conectar con el servidor. Revisa tu conexión a internet.';
  }

  return 'No pudimos completar la acción. Inténtalo de nuevo.';
}
