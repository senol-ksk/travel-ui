import '@/styles/global.css'

import type { Metadata } from 'next'
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import { ViewTransitions } from 'next-view-transitions'

import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

import { Providers } from '@/app/providers'
import Header from '@/components/header'
import { Footer } from '@/components/footer'
import { mantineTheme } from '@/styles/mantine'

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
    <ViewTransitions>
      <html lang='tr' {...mantineHtmlProps}>
        <head>
          <link rel='icon' href='/favicon.ico' sizes='any' />
          <ColorSchemeScript />
        </head>

        <body className='grid gap-5'>
          <Providers>
            <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
              <Header />
              {children}
              <Footer />
            </MantineProvider>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
