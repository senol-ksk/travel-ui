import { createTheme, DEFAULT_THEME, rem } from '@mantine/core'

export const fonts = createTheme({
  fontFamily: 'Roboto, sans-serif',
  headings: {
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
  fontSizes: {
    xxs: rem(10),
    xxl: rem(28),
  },
})
