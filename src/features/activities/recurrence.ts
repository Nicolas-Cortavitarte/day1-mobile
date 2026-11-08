import { longDateLabel } from './dateUtils';

export type RecurrenceFrequency = 'NONE' | 'DAILY' | 'WEEKLY_DAYS' | 'CUSTOM_DAYS';

export type RecurrenceValue = {
  frequency: RecurrenceFrequency;
  daysOfWeek: number[];
  intervalDays: number;
  endDate: string | null;
};

export const DEFAULT_RECURRENCE: RecurrenceValue = {
  frequency: 'NONE',
  daysOfWeek: [],
  intervalDays: 2,
  endDate: null,
};

const WEEKDAY_NAMES: Record<number, string> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miércoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sábado',
};

function joinDayNames(days: number[]): string {
  const sorted = [...days].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
  const names = sorted.map((d) => WEEKDAY_NAMES[d]);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

function capitalize(text: string): string {
  return text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function describeRecurrence(value: RecurrenceValue, startDate: string, startTime: string | null): string {
  const timeSuffix = startTime ? `, a las ${startTime}` : '';
  const startSuffix = ` Empieza el ${longDateLabel(startDate)}.`;

  switch (value.frequency) {
    case 'NONE':
      return 'Esta actividad no se repite.';
    case 'DAILY':
      return `Todos los días${timeSuffix}.${startSuffix}`;
    case 'WEEKLY_DAYS':
      if (value.daysOfWeek.length === 0) return 'Elige al menos un día de la semana.';
      return `Cada ${joinDayNames(value.daysOfWeek)}${timeSuffix}.${startSuffix}`;
    case 'CUSTOM_DAYS':
      return `Se repite cada ${value.intervalDays} día${value.intervalDays === 1 ? '' : 's'}${timeSuffix}.${startSuffix}`;
    default:
      return '';
  }
}

export function recurrenceSummaryLabel(value: RecurrenceValue): string {
  switch (value.frequency) {
    case 'NONE':
      return 'No repetir';
    case 'DAILY':
      return 'Todos los días';
    case 'WEEKLY_DAYS':
      return value.daysOfWeek.length > 0
        ? capitalize(joinDayNames(value.daysOfWeek))
        : 'Días específicos de la semana';
    case 'CUSTOM_DAYS':
      return `Cada ${value.intervalDays} día${value.intervalDays === 1 ? '' : 's'}`;
    default:
      return 'No repetir';
  }
}

export function recurrenceToApiPayload(value: RecurrenceValue) {
  if (value.frequency === 'WEEKLY_DAYS') {
    return { frequency: 'WEEKLY' as const, intervalCount: 1, daysOfWeek: value.daysOfWeek };
  }
  if (value.frequency === 'CUSTOM_DAYS') {
    return { frequency: 'DAILY' as const, intervalCount: value.intervalDays, daysOfWeek: undefined };
  }
  // DAILY ("Todos los días")
  return { frequency: 'DAILY' as const, intervalCount: 1, daysOfWeek: undefined };
}