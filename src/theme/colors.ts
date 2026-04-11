export const colors = {
  Milk: '#FFFFFF',
  Accent: '#FFC107',
  AccentDark: '#B8860B',
  Caution: '#F44336',
  Freeze: '#9E9E9E',
  Dark: '#000000',
  Paper: '#121212',
  Card: '#1A1A1A',
  TextGrey: '#F5F5F5',
  Success: '#8BC34A',
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorKey];
