export function todayISODate(): string {
  return toISODate(new Date());
}

export function isPastDate(dateString: string): boolean {
  return dateString < todayISODate();
}

export function toISODate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateString: string): Date {
  const parts = dateString.split('-').map(Number);
  const year = Number.isFinite(parts[0]) ? parts[0] : new Date().getFullYear();
  const month = Number.isFinite(parts[1]) ? parts[1] : 1;
  const day = Number.isFinite(parts[2]) ? parts[2] : 1;
  const parsed = new Date(0);
  parsed.setFullYear(year, month - 1, day);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export function addDays(dateString: string, amount: number): string {
  const date = parseISODate(dateString);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function addMonths(dateString: string, amount: number): string {
  const date = parseISODate(dateString);
  const day = date.getDate();
  const target = new Date(0);
  target.setFullYear(date.getFullYear(), date.getMonth() + amount, 1);
  target.setHours(0, 0, 0, 0);

  const lastDayOfTargetMonth = new Date(0);
  lastDayOfTargetMonth.setFullYear(target.getFullYear(), target.getMonth() + 1, 0);
  lastDayOfTargetMonth.setHours(0, 0, 0, 0);

  target.setDate(Math.min(day, lastDayOfTargetMonth.getDate()));
  return toISODate(target);
}

export function startOfWeek(dateString: string): string {
  const date = parseISODate(dateString);
  const jsDay = date.getDay();
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  return addDays(dateString, diffToMonday);
}

export function getWeekDates(dateString: string): string[] {
  const monday = startOfWeek(dateString);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function getMonthGrid(dateString: string): (string | null)[][] {
  const date = parseISODate(dateString);
  const firstDayDate = new Date(0);
  firstDayDate.setFullYear(date.getFullYear(), date.getMonth(), 1);
  firstDayDate.setHours(0, 0, 0, 0);

  const firstOfMonth = toISODate(firstDayDate);
  const firstGridDay = startOfWeek(firstOfMonth);

  const cells: (string | null)[] = [];
  let current = firstGridDay;
  for (let i = 0; i < 42; i++) {
    const currentParsed = parseISODate(current);
    const inMonth =
      currentParsed.getMonth() === date.getMonth() &&
      currentParsed.getFullYear() === date.getFullYear();
    cells.push(inMonth ? current : null);
    current = addDays(current, 1);
  }

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < 42; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export function weekdayLabel(dateString: string): string {
  return WEEKDAY_LABELS[parseISODate(dateString).getDay()];
}

export function dayNumber(dateString: string): number {
  return parseISODate(dateString).getDate();
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function monthYearLabel(dateString: string): string {
  const date = parseISODate(dateString);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

const WEEKDAY_FULL_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export function longDateLabel(dateString: string): string {
  const date = parseISODate(dateString);
  const weekday = WEEKDAY_FULL_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].toLowerCase();
  return `${weekday}, ${day} de ${month}`;
}

export function fullDateLabel(dateString: string): string {
  const date = parseISODate(dateString);
  return `${longDateLabel(dateString)} de ${date.getFullYear()}`;
}

export function startOfMonth(dateString: string): string {
  const date = parseISODate(dateString);
  const target = new Date(0);
  target.setFullYear(date.getFullYear(), date.getMonth(), 1);
  target.setHours(0, 0, 0, 0);
  return toISODate(target);
}

export function endOfMonth(dateString: string): string {
  const date = parseISODate(dateString);
  const target = new Date(0);
  target.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
  target.setHours(0, 0, 0, 0);
  return toISODate(target);
}

export function nextWeekAnchor(dateString: string): string {
  return addDays(startOfWeek(dateString), 7);
}

export function prevWeekAnchor(dateString: string): string {
  return addDays(startOfWeek(dateString), -1);
}

export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
