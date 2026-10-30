export const Colors = {
  light: {
    backgroundDefault: '#F8F6F1',
    surfaceCard: '#FFFFFF',
    actionPrimary: '#527D5B',
    actionPressed: '#355C3E',
    surfaceBrandSoft: '#E1EEDF',
    textPrimary: '#303530',
    textSecondaryReadable: '#606A60',
    textOnAction: '#FFFFFF',
    borderSubtle: '#E6E7E1',
    borderControl: '#7E897D',
    statusSuccess: '#3F8056',
    statusWarning: '#A56B28',
    surfaceWarning: '#FFF0D9',
    statusError: '#B84B4B',
    statusInfo: '#477BA4',
    surfaceDisabled: '#E4E8E1',
    surfaceSegmented: '#EDEFE8',
    progressTrack: '#CFDDCD',
    illustrationSoft: '#CDDCC9',
    illustrationMedium: '#A7C2A4',
    surfaceScrim: 'rgba(23, 37, 27, 0.68)',
  },
  dark: {
    backgroundDefault: '#171C18',
    surfaceCard: '#242B25',
    actionPrimary: '#A5CDAA',
    actionPressed: '#B7DAB9',
    surfaceBrandSoft: '#344638',
    textPrimary: '#F4F5F1',
    textSecondaryReadable: '#ADB8AD',
    textOnAction: '#17251B',
    borderSubtle: '#3A453C',
    borderControl: '#829584',
    statusSuccess: '#A5CDAA',
    statusWarning: '#E8BD7C',
    surfaceWarning: '#403321',
    statusError: '#F09A9A',
    statusInfo: '#9FC6E7',
    surfaceDisabled: '#303A32',
    surfaceSegmented: '#2D352E',
    progressTrack: '#445C47',
    illustrationSoft: '#415744',
    illustrationMedium: '#648367',
    surfaceScrim: 'rgba(11, 16, 12, 0.68)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

const FontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
} as const;

export const Typography = {
  display46: { fontFamily: FontFamily.semiBold, fontSize: 46, lineHeight: 46 * 1.4 },
  display32: { fontFamily: FontFamily.semiBold, fontSize: 32, lineHeight: 32 * 1.4 },
  heading28: { fontFamily: FontFamily.semiBold, fontSize: 28, lineHeight: 28 * 1.4 },
  heading26: { fontFamily: FontFamily.semiBold, fontSize: 26, lineHeight: 26 * 1.4 },
  section24: { fontFamily: FontFamily.semiBold, fontSize: 24, lineHeight: 24 * 1.4 },
  section20: { fontFamily: FontFamily.semiBold, fontSize: 20, lineHeight: 20 * 1.4 },
  bodyMedium18: { fontFamily: FontFamily.medium, fontSize: 18, lineHeight: 18 * 1.4 },
  bodySemiBold17: { fontFamily: FontFamily.semiBold, fontSize: 17, lineHeight: 17 * 1.4 },
  bodyRegular16: { fontFamily: FontFamily.regular, fontSize: 16, lineHeight: 16 * 1.4 },
  bodySemiBold16: { fontFamily: FontFamily.semiBold, fontSize: 16, lineHeight: 16 * 1.4 },
  labelRegular15: { fontFamily: FontFamily.regular, fontSize: 15, lineHeight: 15 * 1.4 },
  labelMedium14: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 14 * 1.4 },
  labelRegular14: { fontFamily: FontFamily.regular, fontSize: 14, lineHeight: 14 * 1.4 },
  labelSemiBold14: { fontFamily: FontFamily.semiBold, fontSize: 14, lineHeight: 14 * 1.4 },
  labelMedium13: { fontFamily: FontFamily.medium, fontSize: 13, lineHeight: 13 * 1.4 },
  labelRegular13: { fontFamily: FontFamily.regular, fontSize: 13, lineHeight: 13 * 1.4 },
  labelSemiBold12: { fontFamily: FontFamily.semiBold, fontSize: 12, lineHeight: 12 * 1.4 },
  labelMedium12: { fontFamily: FontFamily.medium, fontSize: 12, lineHeight: 12 * 1.4 },
  labelRegular12: { fontFamily: FontFamily.regular, fontSize: 12, lineHeight: 12 * 1.4 },
} as const;

export const Spacing = {
  2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14, 16: 16,
  20: 20, 24: 24, 28: 28, 32: 32, 40: 40, 48: 48, 64: 64,
} as const;

export const Radius = {
  8: 8, 9: 9, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20, 22: 22, 24: 24,
} as const;

export const MaxContentWidth = 800;