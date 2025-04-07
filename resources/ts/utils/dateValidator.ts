export function isValidDate(dateStr: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || year < 1000) return false;

  const maxDays = new Date(year, month, 0).getDate();

  return day <= maxDays;
}
