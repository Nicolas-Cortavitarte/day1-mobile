export type WeightUnit = 'KG' | 'LB';
export type ThemePreference = 'LIGHT' | 'DARK' | 'SYSTEM';
export type FontScale = 'SMALL' | 'MEDIUM' | 'LARGE';

export type UserPreferences = {
  timezone: string;
  locale: string;
  weekStartsOn: number;
  preferredWeightUnit: WeightUnit;
  notificationsEnabled: boolean;
  defaultReminderMinutes: number | null;
  dailySummaryTime: string | null;
  theme: ThemePreference;
  fontScale: FontScale;
};

export type PreferencesUpdate = Partial<UserPreferences>;

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type ProfileUpdate = {
  displayName?: string | null;
  avatarUrl?: string | null;
};
