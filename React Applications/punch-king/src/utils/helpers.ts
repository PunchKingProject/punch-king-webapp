export const gridWidth = (columns: number): string => {
  if (columns < 1 || columns > 12) {
    console.warn(
      `gridWidth: Expected a value between 1 and 12, received ${columns}`
    );
    return '100%';
  }
  const percentage = (columns / 12) * 100;
  return `${percentage.toFixed(6)}%`; // e.g. '33.333333%'
};


export function displayValue(v: unknown): React.ReactNode {
  if (v === null || v === undefined) return '';
  return typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'
    ? v
    : String(v);
}