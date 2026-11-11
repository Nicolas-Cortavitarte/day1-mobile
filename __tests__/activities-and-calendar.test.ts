import { formatReminderLabel } from '../src/features/activities/reminder';
import {
  DEFAULT_RECURRENCE,
  describeRecurrence,
  recurrenceFromApi,
  recurrenceSummaryLabel,
  recurrenceToApiPayload,
} from '../src/features/activities/recurrence';
import {
  addDays,
  addMonths,
  endOfMonth,
  getMonthGrid,
  getWeekDates,
  isPastDate,
  startOfMonth,
  startOfWeek,
} from '../src/features/activities/dateUtils';

describe('formatReminderLabel', () => {
  it('maneja 0 minutos (a la hora de inicio)', () => {
    expect(formatReminderLabel(0)).toBe('A la hora de inicio');
  });

  it('formatea minutos, horas y días', () => {
    expect(formatReminderLabel(10)).toBe('10 minutos antes');
    expect(formatReminderLabel(60)).toBe('1 hora antes');
    expect(formatReminderLabel(120)).toBe('2 horas antes');
    expect(formatReminderLabel(1440)).toBe('1 día antes');
  });
});

describe('recurrence', () => {
  it('convierte una regla de API a RecurrenceValue y genera etiqueta', () => {
    const weekly = recurrenceFromApi({
      id: 'rec-1',
      userId: 'u1',
      categoryId: 2,
      title: 'Correr',
      description: null,
      frequency: 'WEEKLY',
      intervalCount: 1,
      daysOfWeek: [1, 3, 5],
      startDate: '2026-04-06',
      endDate: null,
      startTime: '07:00',
      durationMinutes: 30,
      reminderMinutes: 10,
      generatedUntil: '2026-06-06',
    });

    expect(weekly.frequency).toBe('WEEKLY_DAYS');
    expect(weekly.daysOfWeek).toEqual([1, 3, 5]);
    expect(recurrenceSummaryLabel(weekly)).toContain('Lunes');
    expect(recurrenceSummaryLabel(weekly)).toContain('miércoles');
    expect(recurrenceSummaryLabel(weekly)).toContain('viernes');

    const payload = recurrenceToApiPayload(weekly);
    expect(payload).toEqual({
      frequency: 'WEEKLY',
      intervalCount: 1,
      daysOfWeek: [1, 3, 5],
    });
  });

  it('describe correctamente la repetición', () => {
    expect(describeRecurrence(DEFAULT_RECURRENCE, '2026-04-06', '08:00')).toBe(
      'Esta actividad no se repite.',
    );
    expect(
      describeRecurrence(
        { frequency: 'DAILY', daysOfWeek: [], intervalDays: 1, endDate: null },
        '2026-04-06',
        '08:00',
      ),
    ).toContain('08:00');
  });
});

describe('dateUtils', () => {
  it('calcula inicio de semana en lunes y los 7 días', () => {
    expect(startOfWeek('2026-04-12')).toBe('2026-04-06');
    const week = getWeekDates('2026-04-08');
    expect(week).toHaveLength(7);
    expect(week[0]).toBe('2026-04-06');
    expect(week[6]).toBe('2026-04-12');
  });

  it('suma días y meses respetando fin de mes', () => {
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2026-11-11', 1)).toBe('2026-12-11');
    expect(addMonths('2026-12-11', 1)).toBe('2027-01-11');
    expect(startOfMonth('2026-02-15')).toBe('2026-02-01');
    expect(endOfMonth('2026-02-15')).toBe('2026-02-28');
  });

  it('genera la cuadrícula mensual sin desfasar meses e identifica fechas pasadas', () => {
    const grid = getMonthGrid('2026-11-01');
    expect(grid).toHaveLength(6);
    const nonNullDays = grid.flat().filter((d): d is string => d !== null);
    expect(nonNullDays).toHaveLength(30);
    expect(nonNullDays[0]).toBe('2026-11-01');
    expect(nonNullDays[29]).toBe('2026-11-30');
    expect(isPastDate('2000-01-01')).toBe(true);
    expect(isPastDate('2099-12-31')).toBe(false);
  });
});
