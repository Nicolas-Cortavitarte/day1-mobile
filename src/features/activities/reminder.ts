export function formatReminderLabel(minutes: number): string {
  if (minutes >= 1440 && minutes % 1440 === 0) {
    const days = minutes / 1440;
    return days === 1 ? '1 día antes' : `${days} días antes`;
  }
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;
    return hours === 1 ? '1 hora antes' : `${hours} horas antes`;
  }
  return `${minutes} minutos antes`;
}