import { createTheme, mergeMantineTheme, DEFAULT_THEME } from '@mantine/core'

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

export const theme = mergeMantineTheme(
  DEFAULT_THEME,
  createTheme({
    fontFamily: inter.style.fontFamily,
  })
)
