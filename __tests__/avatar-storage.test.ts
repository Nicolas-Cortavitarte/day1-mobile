jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(),
    },
  },
}));

import { base64ToUint8Array, extractAvatarStoragePath } from '@/features/profile/avatarStorage';

describe('avatarStorage helpers', () => {
  test('decodes base64 strings into Uint8Array', () => {
    const bytes = base64ToUint8Array('SG9sYQ==');
    expect(Array.from(bytes)).toEqual([72, 111, 108, 97]);
  });

  test('extracts relative path from Supabase public avatar URL', () => {
    const url =
      'https://xyz.supabase.co/storage/v1/object/public/avatars/user-123/avatar-1.jpg?t=123';
    expect(extractAvatarStoragePath(url)).toBe('user-123/avatar-1.jpg');
  });

  test('returns null for external avatar URLs', () => {
    expect(extractAvatarStoragePath('https://lh3.googleusercontent.com/a/photo.jpg')).toBeNull();
  });
});
