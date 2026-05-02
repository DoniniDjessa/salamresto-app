import { useColorScheme } from 'react-native';

// Salamresto Brand Colors - Violet & Dark
export const BrandColors = {
  primary: '#A855F7',        // Salamresto Violet (primary)
  secondary: '#9333EA',      // Deep Violet
  accent: '#C084FC',         // Light Violet
  dark: '#12121A',           // Salamresto Dark (almost black)
  bg: '#12121A',             // Main Background
  bgSecondary: '#1A1A24',    // Secondary Background
  card: '#1E1E2A',           // Card Surface - slightly lighter
  border: 'rgba(168, 85, 247, 0.1)',  // Violet-tinted border
  borderLight: 'rgba(255, 255, 255, 0.05)', // Light border
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A8',
  textMuted: '#6B6B73',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  glow: 'rgba(168, 85, 247, 0.15)',  // Violet glow for active states
};

// Palette for light/dark mode support (if needed in future)
export const PALETTE = {
  dark: {
    bg: '#12121A',
    bgCard: '#1E1E2A',
    bgCardLight: '#282838',
    surface: '#1E1E2A',
    border: 'rgba(255,255,255,0.06)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A8',
    textMuted: '#6B6B73',
    accentGlow: 'rgba(168, 85, 247, 0.15)',
  },
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONTS = {
  light: 'Outfit_300Light',
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semiBold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
};

// Shadows for elevation
export const SHADOWS = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
};
