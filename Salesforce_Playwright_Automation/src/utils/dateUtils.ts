export function currentDatePlusDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeText(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '').replace(/^0+/, '');
}

export function dayMonthVariants(value: string): string[] {
  const parts = value.split('/');
  if (parts.length !== 3) {
    return [value];
  }
  const [day, month, year] = parts;
  return [`${day}/${month}/${year}`, `${month}/${day}/${year}`];
}
