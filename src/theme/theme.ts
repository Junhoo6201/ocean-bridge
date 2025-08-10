export const theme = {
  name: "Linear Design System",
  version: "1.0.0",
  
  colors: {
    brand: {
      primary: "#5e6ad2",
      secondary: "#4ea7fc",
      plan: "#68cc58",
      build: "#d4b144",
      security: "#7a7fad"
    },
    
    semantic: {
      success: "#4cb782",
      error: "#eb5757",
      warning: "#f2c94c",
      info: "#4ea7fc",
      orange: "#fc7840"
    },
    
    neutral: {
      white: "#ffffff",
      black: "#000000",
      gray: {
        50: "#f7f8f8",
        100: "#e8e9eb",
        200: "#d1d3d7",
        300: "#b3b6bd",
        400: "#8a8f98",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#28282c",
        900: "#1a1a1f",
        950: "#111114"
      }
    },
    
    background: {
      primary: "#08090a",
      secondary: "#0a0a0a",
      tertiary: "#111114",
      elevated: "#1a1a1f",
      overlay: "rgba(10, 10, 10, 0.8)",
      hover: "rgba(255, 255, 255, 0.05)",
      active: "rgba(255, 255, 255, 0.1)"
    },
    
    text: {
      primary: "#f7f8f8",
      secondary: "#8a8f98",
      tertiary: "#6b7280",
      disabled: "#4b5563",
      inverse: "#08090a",
      link: "#5e6ad2",
      linkHover: "#4ea7fc"
    },
    
    border: {
      default: "rgba(255, 255, 255, 0.08)",
      strong: "rgba(255, 255, 255, 0.15)",
      subtle: "rgba(255, 255, 255, 0.05)",
      focus: "#5e6ad2"
    },
    
    gradients: [
      "linear-gradient(to right, rgb(247, 248, 248), rgba(0, 0, 0, 0) 80%)",
      "linear-gradient(rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0) 20%)",
      "linear-gradient(134deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0) 55%)",
      "linear-gradient(rgba(255, 255, 255, 0.1) 40%, rgba(8, 9, 10, 0.1))",
      "linear-gradient(rgb(52, 52, 52), rgb(45, 45, 45))"
    ]
  },
  
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", sans-serif',
      serif: '"Tiempos Headline", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: '"Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace',
      emoji: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"'
    },
    
    fontSize: {
      tiny: "0.625rem",
      micro: "0.75rem",
      mini: "0.8125rem",
      small: "0.875rem",
      regular: "0.9375rem",
      base: "1rem",
      large: "1.0625rem",
      xl: "1.3125rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
      "5xl": "3rem",
      "6xl": "3.5rem",
      "7xl": "4rem",
      "8xl": "4.5rem"
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 510,
      semibold: 590,
      bold: 680
    },
    
    lineHeight: {
      tight: 1,
      snug: 1.1,
      normal: 1.4,
      relaxed: 1.6,
      loose: 2
    },
    
    letterSpacing: {
      tighter: "-0.022em",
      tight: "-0.015em",
      normal: "-0.011em",
      wide: "0em",
      wider: "0.025em"
    }
  },
  
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
    40: "160px",
    48: "192px",
    56: "224px",
    64: "256px"
  },
  
  borderRadius: {
    none: "0px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
    "4xl": "32px",
    full: "9999px",
    circle: "50%"
  },
  
  shadows: {
    none: "0px 0px 0px transparent",
    sm: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    md: "0px 4px 24px rgba(0, 0, 0, 0.2)",
    lg: "0px 7px 32px rgba(0, 0, 0, 0.35)",
    xl: "0px 12px 48px rgba(0, 0, 0, 0.4)",
    "2xl": "0px 20px 64px rgba(0, 0, 0, 0.5)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
  },
  
  animation: {
    duration: {
      instant: "0s",
      fast: "0.1s",
      normal: "0.25s",
      slow: "0.5s",
      slower: "1s"
    },
    
    easing: {
      linear: "linear",
      easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      easeOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
      easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
      easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
      easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
      easeInOutExpo: "cubic-bezier(1, 0, 0, 1)"
    }
  },
  
  breakpoints: {
    xs: "480px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
    "3xl": "1920px"
  },
  
  layout: {
    maxWidth: {
      page: "1024px",
      prose: "624px",
      container: "1280px",
      wide: "1536px"
    },
    
    header: {
      height: "64px",
      blur: "20px"
    },
    
    padding: {
      page: {
        inline: "24px",
        block: "64px"
      }
    },
    
    grid: {
      columns: 12
    }
  },
  
  zIndex: {
    base: 1,
    dropdown: 50,
    sticky: 100,
    header: 100,
    overlay: 500,
    popover: 600,
    commandMenu: 650,
    dialog: 700,
    dialogOverlay: 699,
    toast: 800,
    tooltip: 1100,
    contextMenu: 1200,
    skipNav: 5000,
    debug: 5100,
    max: 10000
  },
  
  effects: {
    blur: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      xl: "20px",
      "2xl": "40px"
    },
    
    opacity: {
      0: 0,
      5: 0.05,
      10: 0.1,
      20: 0.2,
      30: 0.3,
      40: 0.4,
      50: 0.5,
      60: 0.6,
      70: 0.7,
      80: 0.8,
      90: 0.9,
      100: 1
    }
  }
} as const;

export type Theme = typeof theme;