export function validateBirthDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !isNaN(d.getTime()) && d.getFullYear() >= 1900 && d.getFullYear() <= 2100;
}

export function validateBirthTime(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const [h, m] = time.split(':').map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

export function validateGender(gender: string): gender is 'male' | 'female' {
  return gender === 'male' || gender === 'female';
}

export function validateCalendarType(type: string): type is 'solar' | 'lunar' {
  return type === 'solar' || type === 'lunar';
}
