// Brand colors from Deck and Balcony Inspections Inc.
export const Colors = {
  // Primary brand
  primary: '#8CC63F',       // Logo green
  primaryDark: '#6BA32E',   // Darker green for headers/buttons
  primaryLight: '#A8D66A',  // Lighter green for backgrounds

  // Status colors (from inspection report color code legend)
  statusRed: '#ED1C24',     // Immediate Action Required
  statusYellow: '#FFF200',  // Repairs Required ASAP
  statusBlue: '#0072BC',    // Maintenance Required
  statusGreen: '#8CC63F',   // No Problems Found

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  inputBg: '#FAFAFA',

  // Utility
  error: '#D32F2F',
  success: '#388E3C',
  overlay: 'rgba(0,0,0,0.5)',
};

export const Fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    title: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};
