export function todayISODate(): string {
  return toISODate(new Date());
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(dateString: string, amount: number): string {
  const date = parseISODate(dateString);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function addMonths(dateString: string, amount: number): string {
  const date = parseISODate(dateString);
  const day = date.getDate();
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const daysInTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, daysInTargetMonth));
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
  const firstOfMonth = toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
  const firstGridDay = startOfWeek(firstOfMonth);

  const cells: (string | null)[] = [];
  let current = firstGridDay;
  for (let i = 0; i < 42; i++) {
    const inMonth = parseISODate(current).getMonth() === date.getMonth();
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
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function monthYearLabel(dateString: string): string {
  const date = parseISODate(dateString);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

const WEEKDAY_FULL_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
];

export function longDateLabel(dateString: string): string {
  const date = parseISODate(dateString);
  const weekday = WEEKDAY_FULL_NAMES[date.getDay()];
  const day = date.getDate();
  const month = monthYearLabel(dateString).split(' ')[0];
  return `${weekday}, ${day} de ${month.toLowerCase()}`;
}

export function startOfMonth(dateString: string): string {
  const date = parseISODate(dateString);
  return toISODate(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function endOfMonth(dateString: string): string {
  const date = parseISODate(dateString);
  return toISODate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

export function nextWeekAnchor(dateString: string): string {
  return addDays(startOfWeek(dateString), 7);
}

export function prevWeekAnchor(dateString: string): string {
  return addDays(startOfWeek(dateString), -1);
}