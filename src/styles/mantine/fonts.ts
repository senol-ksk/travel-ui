import { createTheme } from '@mantine/core'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

export const fonts = createTheme({
  fontFamily: inter.style.fontFamily,
  headings: {
    fontWeight: '600',
  },
})
