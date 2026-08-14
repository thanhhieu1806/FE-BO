/**
 * Design colors — synced with Figma token sets:
 * 01. Global, 02. Alias, 03. Components
 * Source JSON: ./figma/*.tokens.json
 */

const palette = {
  primary: {
    50: '#F5F8FF',
    100: '#DBE8FF',
    200: '#8AB2FF',
    300: '#548EFF',
    400: '#3379FF',
    500: '#0057FF',
    600: '#004FE8',
    700: '#003EB5',
    800: '#00308C',
    900: '#00256B',
  },
  grey: {
    10: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: {
    DEFAULT: '#FFFFFF',
    500: '#FCFCFC',
  },
  red: {
    10: '#FEF2F2',
    100: '#F0B4B0',
    500: '#D00D00',
    700: '#940900',
  },
  green: {
    10: '#F0FDF4',
    500: '#058900',
  },
  orange: {
    10: '#FEF2E6',
    500: '#F97C00',
    900: '#693400',
  },
  blue: {
    10: '#F0F9FF',
    100: '#E0F2FE',
    500: '#0EA5E9',
  },
  yellow: {
    10: '#FEFBE9',
    500: '#FFD41D',
  },
  violet: {
    10: '#F3ECFD',
    500: '#853EEF',
  },
};

const brand = {
  primary: palette.primary[500],
  secondary: palette.primary[800],
};

const text = {
  primary: palette.grey[800],
  secondary: palette.grey[500],
  tertiary: palette.grey[400],
  disable: palette.grey[300],
  reverse: palette.white[500],
  brand: brand.primary,
  link: palette.blue[500],
  error: palette.red[500],
  success: palette.green[500],
  warning: palette.orange[500],
  inprogress: palette.orange[900],
  violet: palette.violet[500],
};

const icon = {
  primary: palette.grey[800],
  secondary: palette.grey[500],
  reverse: palette.white[500],
  brand: brand.primary,
  disable: palette.grey[200],
  link: palette.blue[500],
  error: palette.red[500],
  success: palette.green[500],
  warning: palette.orange[500],
  inprogress: palette.orange[900],
  violet: palette.violet[500],
};

const border = {
  primary: palette.grey[200],
  secondary: palette.primary[100],
  reverse: palette.white.DEFAULT,
  disable: palette.grey[100],
  brand: brand.primary,
  error: palette.red[500],
  success: palette.green[500],
  warning: palette.orange[500],
  info: palette.blue[500],
};

const surface = {
  primary: palette.white.DEFAULT,
  secondary: palette.grey[10],
  tertiary: palette.grey[100],
  dark: palette.grey[800],
  brand: brand.primary,
  dimBrandLv1: palette.primary[50],
  dimBrandLv2: palette.primary[100],
  dimGrey: palette.grey[10],
  dimGreen: palette.green[10],
  dimRed: palette.red[10],
  dimYellow: palette.orange[10],
  dimBlue: palette.blue[10],
  dimViolet: palette.violet[10],
  statusDisable: palette.grey[200],
  statusError: palette.red[500],
  statusSuccess: palette.green[500],
  statusWarning: palette.orange[500],
  statusInfo: palette.blue[100],
  statusViolet: palette.violet[10],
};

const sidebar = {
  bg: palette.primary[50],
  textDefault: palette.grey[800],
  textActive: brand.primary,
  iconDefault: palette.grey[500],
  iconActive: brand.primary,
  itemActiveBg: palette.primary[50],
};

const navbar = {
  bg: palette.white.DEFAULT,
};

const chart = {
  success: palette.green[500],
  failed: palette.red[500],
  donut: {
    face: '#1E5BFF',
    other: '#D1D5DB',
    fingerprint: '#F50064',
    iris: '#FFC928',
    palm: '#7B3FF2',
    visitor: '#FF8C00',
    // attendance segments
    present: '#1E5BFF',
    absent: '#F50064',
    late: '#FFC928',
    // visitor segments
    'checked-in': '#1E5BFF',
    'checked-out': '#D1D5DB',
    pending: '#FFC928',
  },
};

module.exports = {
  palette,
  brand,
  text,
  icon,
  border,
  surface,
  sidebar,
  navbar,
  chart,
};