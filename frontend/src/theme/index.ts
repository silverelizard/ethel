import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f5f0ff',
      100: '#e1d5ff',
      200: '#c9b3ff',
      300: '#ad8bff',
      400: '#9466ff',
      500: '#7b3fff',
      600: '#6a2ee6',
      700: '#5622b3',
      800: '#411980',
      900: '#2d114d',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
})

export default theme
