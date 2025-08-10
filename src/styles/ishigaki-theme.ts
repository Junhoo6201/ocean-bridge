// Ishigaki Tropical Resort Theme for Ocean Components

export const ishigakiTheme = {
  colors: {
    brand: {
      primary: '#26D0CE',    // Bright turquoise (lagoon)
      secondary: '#1AC8DB',  // Sky aqua
      accent: '#7FDBFF',     // Soft cyan
      highlight: '#B3ECFF',  // Pale sky
    },
    semantic: {
      coral: '#FF8787',      // Soft coral (activities, urgent)
      sand: '#FFF4E6',       // Cream sand (comfort, relaxation)
      sunset: '#FFB347',     // Soft orange (premium, special)
      tropical: '#4ECDC4',   // Mint green (eco-tours, nature)
      pearl: '#F7F7F7',      // Pearl white (neutral)
    },
    background: {
      primary: '#FFFFFF',     // Pure white
      secondary: '#F8FFFE',   // Mint white
      tertiary: '#F0FFFE',    // Aqua white
      elevated: '#FFFFFF',    // Card background (use shadows for depth)
      overlay: 'rgba(255, 255, 255, 0.95)',
      glass: 'rgba(38, 208, 206, 0.06)',
    },
    text: {
      primary: '#2C3E50',    // Charcoal gray
      secondary: '#546E7A',  // Blue gray
      tertiary: '#78909C',   // Light gray
      muted: '#B0BEC5',      // Muted gray
      inverse: '#FFFFFF',    // White text on colored backgrounds
    },
    status: {
      success: '#4ECDC4',    // Tropical mint
      warning: '#FFB347',    // Sunset orange
      error: '#FF8787',      // Soft coral
      info: '#7FDBFF',       // Soft cyan
    },
    border: {
      light: 'rgba(0, 0, 0, 0.06)',
      medium: 'rgba(0, 0, 0, 0.12)',
      dark: 'rgba(0, 0, 0, 0.24)',
      brand: 'rgba(38, 208, 206, 0.3)',
    }
  },
  
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 16px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.16)',
    xl: '0 12px 48px rgba(0, 0, 0, 0.20)',
    soft: '0 2px 20px rgba(38, 208, 206, 0.15)',  // Turquoise glow
    coral: '0 4px 20px rgba(255, 135, 135, 0.25)', // Coral glow
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '24px',
    full: '9999px',
  },
  
  typography: {
    fontFamily: {
      sans: '"Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '60px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },
}

export default ishigakiTheme
