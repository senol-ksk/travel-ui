import '@/styles/global.css'

import type { Metadata } from 'next'

import { MantineProvider } from '@mantine/core'

import { Providers } from '@/app/providers'

import Header from '@/components/header'
import { theme } from '../theme'

import dayjs from 'dayjs'

import 'dayjs/locale/tr'
import { RouterTransition } from '@/components/router-transition'
dayjs.locale('tr')

export const metadata: Metadata = {
  title: 'Fulltrip',
  description: `Seyahat planı yapmadan biraz ilham almaya ne dersiniz? Seyahatin En İyilerini sizin için topluyoruz.`,
  metadataBase: new URL('https://fulltrip.com'),
  alternates: {
    canonical: './',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>

      <body>
        <Providers>
          <MantineProvider theme={theme} defaultColorScheme='light'>
            <RouterTransition />

            <Header />
            <main>{children}</main>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}
