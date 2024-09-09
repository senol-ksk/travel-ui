import { createTheme, rem, TabsTab } from '@mantine/core'

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

export const theme = createTheme({
  fontFamily: inter.style.fontFamily,
})
