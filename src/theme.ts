'use client'

import { Roboto } from 'next/font/google'

// just want to try CSSVarTheme
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }
  
  interface PaletteOptions {
    glow: string
    radius: string
  }

  interface Palette {
    glow: string
    radius: string
  }
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto'
})


const theme = extendTheme({
  spacing: 4,
  breakpoints: {
    values: {
      mobile: 360,
      tablet: 640,
      laptop: 1024,
      desktop: 1200,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  colorSchemes: {
    light: {
      // palette for light mode
      palette: {
        primary: {
          main: '#FFF',
        },
        background: {
          defaultChannel:
            'linear-gradient(to bottom, transparent, rgb(var(255, 255, 255))) rgb(var(214, 219, 220))',
          paperChannel: 'rgb(0, 0, 0)',
        },
        glow: 'conic-gradient(from 180deg at 50% 50%, #16abff33 0deg, #0885ff33 55deg, #54d6ff33 120deg, #0071ff33 160deg, transparent 360deg)',
        radius: '12px',
      },
    },
    dark: {
      // palette for dark mode
      palette: {
        primary: {
          main: '#000',
        },
        background: {
          defaultChannel: 'rgb(0, 0, 0)',
          paperChannel: 'rgb(255, 255, 255)',
        },
        glow: 'radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0))',
        radius: '12px',
      },
    },
  },
})

export default theme
