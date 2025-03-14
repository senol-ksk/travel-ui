import { createTheme } from '@mantine/core'
import { Figtree } from 'next/font/google'

const inter = Figtree({
  subsets: ['latin'],
})

export const fonts = createTheme({
  fontFamily: inter.style.fontFamily,
  headings: {
    fontWeight: '600',
  },
})
