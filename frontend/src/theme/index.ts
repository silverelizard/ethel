import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// Follow the OS light/dark setting until the visitor uses the toggle; their
// choice is then remembered (localStorage).
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
}

/**
 * "Whiskey amber": amber/copper accent on warm stone neutrals.
 *
 * The brand scale is laid out for Chakra's colorScheme conventions:
 * light-mode solid buttons use 500 (with white text) and dark-mode solid
 * buttons use 200 (with dark text), so 500 is the deep amber and 200 the
 * bright one.
 */
const brand = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#F59E0B',
  300: '#D97706',
  400: '#C2620A',
  500: '#B45309',
  600: '#92400E',
  700: '#78350F',
  800: '#5C2A0C',
  900: '#3F1D08',
}

// Warm stone grays instead of Chakra's cool grays.
const gray = {
  50: '#FAFAF9',
  100: '#F5F5F4',
  200: '#E7E5E4',
  300: '#D6D3D1',
  400: '#A8A29E',
  500: '#78716C',
  600: '#57534E',
  700: '#44403C',
  800: '#292524',
  900: '#1C1917',
}

const theme = extendTheme({
  config,
  colors: { brand, gray },
  semanticTokens: {
    colors: {
      // Chakra's built-in tokens (page background, default text, borders).
      'chakra-body-bg': { _light: '#FAF8F5', _dark: '#16130F' },
      'chakra-body-text': { _light: '#292524', _dark: '#EDE6DC' },
      'chakra-border-color': { _light: '#E7E5E4', _dark: '#3A332B' },
      'chakra-placeholder-color': { _light: 'gray.400', _dark: 'gray.500' },

      // App tokens: use these instead of raw colors in components.
      'bg.canvas': { _light: '#FAF8F5', _dark: '#16130F' },
      'bg.surface': { _light: '#FFFFFF', _dark: '#201C17' },
      'bg.subtle': { _light: 'gray.100', _dark: '#2A251F' },
      'text.subtle': { _light: '#57534E', _dark: '#C9C0B4' },
      'text.muted': { _light: '#78716C', _dark: '#A8A29E' },
      'border.subtle': { _light: '#E7E5E4', _dark: '#3A332B' },
      'accent.fg': { _light: '#B45309', _dark: '#F59E0B' },
      'accent.subtle': { _light: '#FEF3C7', _dark: 'rgba(245, 158, 11, 0.14)' },
    },
  },
  components: {
    // Dialogs and the mobile drawer sit on the surface color, not Chakra's gray.700.
    Modal: { baseStyle: { dialog: { bg: 'bg.surface' } } },
    Drawer: { baseStyle: { dialog: { bg: 'bg.surface' } } },
    Table: {
      variants: {
        simple: {
          th: { borderColor: 'border.subtle', color: 'text.muted' },
          td: { borderColor: 'border.subtle' },
        },
      },
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
})

export default theme
