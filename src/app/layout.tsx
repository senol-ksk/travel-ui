import '@/styles/global.css'

import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
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
import { Suspense } from 'react'
import { Notifications } from '@mantine/notifications'

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
      <SessionProvider>
        <html lang='tr' {...mantineHtmlProps}>
          <head>
            <link rel='icon' href='/favicon.ico' sizes='any' />
            <ColorSchemeScript />
          </head>

          <body className='flex flex-col'>
            <Providers>
              <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
                <Notifications />

                <div className='shrink-0 grow-0'>
                  <Header />
                </div>
                <main className='grow-1'>{children}</main>
                <Suspense>
                  <div className='shrink-0 grow-0'>
                    <Footer />
                  </div>
                </Suspense>
              </MantineProvider>
            </Providers>
          </body>
        </html>
      </SessionProvider>
    </ViewTransitions>
  )
}
