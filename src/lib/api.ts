import { API_BASE_URL } from '@env';
import { ApiError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

const REQUEST_TIMEOUT_MS = 15_000;
const BASE_URL = API_BASE_URL.replace(/\/+$/, '');

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

const STATUS_MESSAGES: Record<number, string> = {
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para hacer esto.',
  404: 'No encontramos lo que buscas.',
  429: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.',
};

function extractServerMessage(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { message?: unknown };
    return typeof parsed.message === 'string' ? parsed.message : null;
  } catch {
    return null;
  }
}

function buildErrorMessage(status: number, body: string): string {
  if (status >= 500) {
    return 'Algo salió mal de nuestro lado. Inténtalo de nuevo en un momento.';
  }

  const serverMessage = extractServerMessage(body);
  if (serverMessage && [400, 404, 409, 422].includes(status)) {
    return serverMessage;
  }

  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  if (status === 400) return 'Revisa los datos ingresados e inténtalo de nuevo.';
  return 'No pudimos completar la solicitud. Inténtalo de nuevo.';
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new ApiError(STATUS_MESSAGES[401], 401);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new ApiError('La solicitud tardó demasiado. Revisa tu conexión e inténtalo de nuevo.', 0);
    }
    throw new ApiError('No pudimos conectar con el servidor. Revisa tu conexión a internet.', 0);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new ApiError(buildErrorMessage(response.status, errorBody), response.status);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
