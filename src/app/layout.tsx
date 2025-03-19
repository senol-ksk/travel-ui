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
import { mantineTheme } from '@/styles/mantine'

import Header from '@/components/header'
import { Footer } from '@/components/footer'

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

        <body className='flex flex-col'>
          <Providers>
            <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
              <div className='shrink-0 grow-0'>
                <Header />
              </div>
              <main className='grow-1'>{children}</main>
              <div className='shrink-0 grow-0'>
                <Footer />
              </div>
            </MantineProvider>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
