import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type MuscleGroupKey =
  | 'pecho'
  | 'espalda'
  | 'piernas'
  | 'hombros'
  | 'brazos'
  | 'core'
  | 'cardio'
  | 'general';

export const MUSCLE_GROUP_PRESETS: { key: MuscleGroupKey; label: string }[] = [
  { key: 'pecho', label: 'Pecho' },
  { key: 'espalda', label: 'Espalda' },
  { key: 'piernas', label: 'Piernas' },
  { key: 'hombros', label: 'Hombros' },
  { key: 'brazos', label: 'Brazos' },
  { key: 'core', label: 'Core' },
  { key: 'cardio', label: 'Cardio' },
];

export function resolveMuscleGroupKey(
  muscleGroup?: string | null,
  exerciseName?: string | null,
): MuscleGroupKey {
  const source = `${muscleGroup ?? ''} ${exerciseName ?? ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/pecho|pectoral|banca|aperturas|flexiones/.test(source)) return 'pecho';
  if (/espalda|dorsal|remo|dominada|jalon/.test(source)) return 'espalda';
  if (/pierna|cuadriceps|isquio|gluteo|sentadilla|prensa|gemelo|peso muerto|zancada/.test(source)) {
    return 'piernas';
  }
  if (/hombro|deltoide|militar|elevacion lateral/.test(source)) return 'hombros';
  if (/brazo|biceps|triceps|curl|fondos|antebrazo/.test(source)) return 'brazos';
  if (/core|abdomen|abdominal|plancha|lumbar/.test(source)) return 'core';
  if (/cardio|correr|bici|cinta|eliptica|cuerda| Salto/i.test(source)) return 'cardio';
  return 'general';
}

type Day1ExerciseThumbnailProps = {
  muscleGroup?: string | null;
  exerciseName?: string | null;
  size?: number;
};

export function Day1ExerciseThumbnail({
  muscleGroup,
  exerciseName,
  size = 44,
}: Day1ExerciseThumbnailProps) {
  const colors = useTheme();
  const groupKey = resolveMuscleGroupKey(muscleGroup, exerciseName);
  const stroke = colors.actionPressed;
  const accent = colors.actionPrimary;
  const softFill = colors.illustrationMedium;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size >= 48 ? Radius[16] : Radius[12],
          backgroundColor: colors.surfaceBrandSoft,
          borderColor: colors.borderSubtle,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      <Svg width={size * 0.64} height={size * 0.64} viewBox="0 0 32 32" fill="none">
        {groupKey === 'pecho' && (
          <>
            <Path
              d="M6 10C8 7 13 7 16 10C19 7 24 7 26 10V18C26 21 21 23 16 21C11 23 6 21 6 18V10Z"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Path d="M16 10V21" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
            <Path d="M3 15H29" stroke={accent} strokeWidth={2.2} strokeLinecap="round" />
          </>
        )}

        {groupKey === 'espalda' && (
          <>
            <Path
              d="M7 8L16 6L25 8L22 24L16 26L10 24L7 8Z"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Path d="M16 6V26" stroke={stroke} strokeWidth={2} strokeDasharray="2 2" />
            <Path d="M10 13L16 16L22 13" stroke={accent} strokeWidth={2} strokeLinecap="round" />
          </>
        )}

        {groupKey === 'piernas' && (
          <>
            <Path
              d="M10 6H22L23 15L20 27H17L16 16L15 27H12L9 15L10 6Z"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Circle cx="12.5" cy="12" r="1.5" fill={accent} />
            <Circle cx="19.5" cy="12" r="1.5" fill={accent} />
          </>
        )}

        {groupKey === 'hombros' && (
          <>
            <Circle cx="8" cy="16" r="5" fill={softFill} stroke={stroke} strokeWidth={2} />
            <Circle cx="24" cy="16" r="5" fill={softFill} stroke={stroke} strokeWidth={2} />
            <Path d="M13 15H19" stroke={stroke} strokeWidth={2.4} strokeLinecap="round" />
            <Path d="M5 9L11 11M27 9L21 11" stroke={accent} strokeWidth={2} strokeLinecap="round" />
          </>
        )}

        {groupKey === 'brazos' && (
          <>
            <Path
              d="M8 21C8 16 12 13 16 14C17 10 21 8 24 10C26 12 25 17 22 21C19 24 12 24 8 21Z"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Rect x="19" y="6" width="7" height="3" rx="1.5" fill={accent} />
          </>
        )}

        {groupKey === 'core' && (
          <>
            <Rect
              x="9"
              y="5"
              width="14"
              height="22"
              rx="5"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
            />
            <Path d="M16 7V25M11 12H21M11 17H21M11 22H21" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" />
          </>
        )}

        {groupKey === 'cardio' && (
          <>
            <Path
              d="M16 26C16 26 6 19.5 6 12.5C6 9 8.8 6.5 12 6.5C13.9 6.5 15.3 7.5 16 8.8C16.7 7.5 18.1 6.5 20 6.5C23.2 6.5 26 9 26 12.5C26 19.5 16 26 16 26Z"
              fill={softFill}
              stroke={stroke}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Path
              d="M9 16H13L14.8 12.5L17.2 19L19 16H23"
              stroke={ stroke }
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {groupKey === 'general' && (
          <>
            <Rect x="4" y="11" width="4" height="10" rx="1.5" fill={softFill} stroke={stroke} strokeWidth={2} />
            <Rect x="8" y="9" width="3" height="14" rx="1" fill={accent} stroke={stroke} strokeWidth={1.8} />
            <Rect x="21" y="9" width="3" height="14" rx="1" fill={accent} stroke={stroke} strokeWidth={1.8} />
            <Rect x="24" y="11" width="4" height="10" rx="1.5" fill={softFill} stroke={stroke} strokeWidth={2} />
            <Path d="M11 16H21" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
