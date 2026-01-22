/**
 * 🦕 Dino-Green Design Tokens
 * Professional design system tokens for Quiz App
 */

// ========================================
// COLOR PALETTE
// ========================================

export const COLORS = {
  // Primary - Dino-Green Spectrum
  dino: {
    primary: {
      900: "#0B4619", // Deep Forest
      800: "#0F5A22", // Ancient Moss
      700: "#16692B", // Jurassic Green
      600: "#1E8537", // Prehistoric Leaf
      500: "#26A444", // Dino Main (Brand color)
      400: "#3DB85F", // Living Fern
      300: "#5FD07B", // Young Sprout
      200: "#9BE3AE", // Soft Moss
      100: "#C7F0D2", // Morning Dew
      50: "#E8F8EC", // Mist
    },
  },

  // Secondary - Earthy Complements
  amber: {
    600: "#D97706", // Amber Sun
    500: "#F59E0B", // Golden Hour
    400: "#FBBF24", // Bright Amber
    100: "#FEF3C7", // Soft Glow
  },

  clay: {
    700: "#78350F", // Ancient Clay
    600: "#92400E", // Fossil Brown
    500: "#A8501E", // Terracotta
  },

  sky: {
    600: "#0284C7", // Clear Sky
    500: "#0EA5E9", // Lagoon Blue
    400: "#38BDF8", // Bright Sky
    100: "#E0F2FE", // Water Mist
  },

  // Semantic Colors
  semantic: {
    success: "#1E8537", // dino-primary-600
    successLight: "#C7F0D2", // dino-primary-100
    successDark: "#0F5A22", // dino-primary-800

    error: "#DC2626", // Red-600
    errorLight: "#FEE2E2", // Red-100
    errorDark: "#991B1B", // Red-800

    warning: "#F59E0B", // Amber-500
    warningLight: "#FEF3C7", // Amber-100
    warningDark: "#D97706", // Amber-600

    info: "#0EA5E9", // Sky-500
    infoLight: "#E0F2FE", // Sky-100
    infoDark: "#0284C7", // Sky-600
  },

  // Neutral - Professional grays with green undertone
  neutral: {
    950: "#0A0F0C", // Almost black with green hint
    900: "#1C2621", // Deep charcoal
    800: "#2D3C34", // Dark slate
    700: "#3F5347", // Slate
    600: "#5A6E60", // Medium gray-green
    500: "#7A8B7E", // Neutral gray
    400: "#9BA89F", // Light gray
    300: "#BCC5BF", // Soft gray
    200: "#D9E0DB", // Very light gray
    100: "#EDF1EE", // Off white
    50: "#F8FAF9", // Almost white with green tint
  },
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const TYPOGRAPHY = {
  fontFamily: {
    display:
      '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    body: '"Inter", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    heading: '"Sora", "Inter", -apple-system, BlinkMacSystemFont, sans-serif', // Geometric, modern
  },

  fontSize: {
    // Display - Large headers
    displayXl: "3.75rem", // 60px
    displayLg: "3rem", // 48px
    displayMd: "2.25rem", // 36px

    // Headings
    h1: "2.25rem", // 36px
    h2: "1.875rem", // 30px
    h3: "1.5rem", // 24px
    h4: "1.25rem", // 20px
    h5: "1.125rem", // 18px
    h6: "1rem", // 16px

    // Body
    lg: "1.125rem", // 18px
    base: "1rem", // 16px (default)
    sm: "0.875rem", // 14px
    xs: "0.75rem", // 12px
    "2xs": "0.6875rem", // 11px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// ========================================
// SPACING
// ========================================

export const SPACING = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// ========================================
// BORDER RADIUS
// ========================================

export const RADIUS = {
  none: "0",
  sm: "0.25rem", // 4px - Subtle
  base: "0.5rem", // 8px - Default
  md: "0.75rem", // 12px - Cards
  lg: "1rem", // 16px - Large cards
  xl: "1.5rem", // 24px - Hero elements
  "2xl": "2rem", // 32px - Special elements
  "3xl": "3rem", // 48px - Extra large
  full: "9999px", // Pills, avatars
} as const;

// ========================================
// SHADOWS
// ========================================

export const SHADOWS = {
  xs: "0 1px 2px 0 rgba(11, 70, 25, 0.05)",
  sm: "0 2px 4px -1px rgba(11, 70, 25, 0.08), 0 2px 3px -1px rgba(11, 70, 25, 0.06)",
  base: "0 4px 6px -1px rgba(11, 70, 25, 0.1), 0 2px 4px -1px rgba(11, 70, 25, 0.06)",
  md: "0 4px 6px -1px rgba(11, 70, 25, 0.1), 0 2px 4px -1px rgba(11, 70, 25, 0.06)",
  lg: "0 10px 15px -3px rgba(11, 70, 25, 0.1), 0 4px 6px -2px rgba(11, 70, 25, 0.05)",
  xl: "0 20px 25px -5px rgba(11, 70, 25, 0.1), 0 10px 10px -5px rgba(11, 70, 25, 0.04)",
  "2xl": "0 25px 50px -12px rgba(11, 70, 25, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(11, 70, 25, 0.06)",
  none: "0 0 #0000",

  // Colored shadow for primary elements
  primary:
    "0 10px 20px -5px rgba(38, 164, 68, 0.3), 0 4px 6px -2px rgba(38, 164, 68, 0.15)",
  primaryLg:
    "0 20px 30px -10px rgba(38, 164, 68, 0.4), 0 8px 12px -4px rgba(38, 164, 68, 0.2)",
} as const;

// ========================================
// ANIMATIONS
// ========================================

export const ANIMATION = {
  duration: {
    fast: "150ms",
    base: "200ms",
    medium: "300ms",
    slow: "500ms",
    slower: "700ms",
  },

  timing: {
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// ========================================
// BREAKPOINTS
// ========================================

export const BREAKPOINTS = {
  sm: "640px", // Mobile landscape
  md: "768px", // Tablet portrait
  lg: "1024px", // Tablet landscape
  xl: "1280px", // Desktop
  "2xl": "1536px", // Large desktop
} as const;

// ========================================
// Z-INDEX
// ========================================

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
} as const;

// ========================================
// ICON SIZES
// ========================================

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  base: 20,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
} as const;

// ========================================
// COMPONENT TOKENS
// ========================================

export const COMPONENT_TOKENS = {
  button: {
    height: {
      sm: "2rem", // 32px
      base: "2.5rem", // 40px
      lg: "3rem", // 48px
    },
    padding: {
      sm: "0.5rem 1rem",
      base: "0.75rem 1.5rem",
      lg: "1rem 2rem",
    },
  },

  input: {
    height: {
      sm: "2rem", // 32px
      base: "2.5rem", // 40px
      lg: "3rem", // 48px
    },
  },

  card: {
    padding: {
      sm: "1rem",
      base: "1.5rem",
      lg: "2rem",
    },
  },
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get color with opacity
 * @param color Hex color
 * @param opacity Opacity value (0-1)
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Get contrast color (black or white) based on background
 * @param hexColor Background color in hex
 */
export const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace("#", "");
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? COLORS.neutral[900] : COLORS.neutral[50];
};

// Export all tokens as a single object
export const DESIGN_TOKENS = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  iconSizes: ICON_SIZES,
  components: COMPONENT_TOKENS,
} as const;

export default DESIGN_TOKENS;
