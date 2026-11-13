import { supabase } from '@/lib/supabase';

const AVATAR_BUCKET = 'avatars';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
  const byteLength = (clean.length * 3) / 4 - padding;
  const bytes = new Uint8Array(byteLength);

  let byteIndex = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const c1 = BASE64_CHARS.indexOf(clean[i]);
    const c2 = BASE64_CHARS.indexOf(clean[i + 1]);
    const c3 = BASE64_CHARS.indexOf(clean[i + 2]);
    const c4 = BASE64_CHARS.indexOf(clean[i + 3]);

    const chunk = (c1 << 18) | (c2 << 12) | ((c3 < 0 ? 0 : c3) << 6) | (c4 < 0 ? 0 : c4);

    if (byteIndex < byteLength) bytes[byteIndex++] = (chunk >> 16) & 255;
    if (byteIndex < byteLength) bytes[byteIndex++] = (chunk >> 8) & 255;
    if (byteIndex < byteLength) bytes[byteIndex++] = chunk & 255;
  }

  return bytes;
}

function getExtensionFromMimeType(mimeType?: string | null): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

export function extractAvatarStoragePath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return null;

  const rawPath = publicUrl.slice(markerIndex + marker.length);
  const queryIndex = rawPath.indexOf('?');
  const cleanPath = queryIndex === -1 ? rawPath : rawPath.slice(0, queryIndex);
  return cleanPath ? decodeURIComponent(cleanPath) : null;
}

export async function removeUserAvatarFile(publicUrl: string): Promise<void> {
  const path = extractAvatarStoragePath(publicUrl);
  if (!path) return;
  await supabase.storage.from(AVATAR_BUCKET).remove([path]);
}

type UploadUserAvatarParams = {
  userId: string;
  base64: string;
  mimeType?: string | null;
  previousUrl?: string | null;
};

export async function uploadUserAvatar({
  userId,
  base64,
  mimeType,
  previousUrl,
}: UploadUserAvatarParams): Promise<string> {
  const ext = getExtensionFromMimeType(mimeType);
  const contentType = mimeType || 'image/jpeg';
  const filePath = `${userId}/avatar-${Date.now()}.${ext}`;
  const bytes = base64ToUint8Array(base64);

  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(filePath, bytes, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(error.message || 'No se pudo subir la imagen al almacenamiento.');
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública de la foto.');
  }

  if (previousUrl && previousUrl !== data.publicUrl) {
    removeUserAvatarFile(previousUrl).catch(() => {});
  }

  return data.publicUrl;
}
