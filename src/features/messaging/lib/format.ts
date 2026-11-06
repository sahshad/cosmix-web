function toDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatMessageTime(value?: string): string {
  const date = toDate(value);
  if (!date) return '';

  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatMessageDate(value?: string): string {
  const date = toDate(value);
  if (!date) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
}

export function isSameMessageDay(a?: string, b?: string): boolean {
  const first = toDate(a);
  const second = toDate(b);
  if (!first || !second) return false;
  return isSameDay(first, second);
}
