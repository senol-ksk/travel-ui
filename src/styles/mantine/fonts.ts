import { createTheme, DEFAULT_THEME, rem } from '@mantine/core'

export const fonts = createTheme({
  fontFamily: 'CentraNo2, Roboto, sans-serif',
  headings: {
    fontFamily: `CentraNo2, ${DEFAULT_THEME.fontFamily}`,
  },
  fontSizes: {
    xxs: rem(10),
    xxl: rem(28),
  },
})
