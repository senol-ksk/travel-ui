import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'

import '@/styles/global.css'

import type { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'

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
import { CallFormDrawer } from '@/components/call-form/CallFormDrawer'

export const metadata: Metadata = {
  title: process.env.APP_TITLE,
  description: `Seyahat planı yapmadan biraz ilham almaya ne dersiniz? Seyahatin En İyilerini sizin için topluyoruz.`,
  metadataBase: new URL('https://www.paraflytravel.com'),
  alternates: {
    canonical: './',
  },
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'only light',
  themeColor: '#fff',
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
            <ColorSchemeScript forceColorScheme='light' />
          </head>

          <body className='flex flex-col'>
            <MantineProvider theme={mantineTheme} forceColorScheme='light'>
              <Providers>
                <Notifications />

                <div className='shrink-0 grow-0'>
                  <Header />
                </div>
                <main className='grow-1'>{children}</main>
                <Suspense>
                  <div className='shrink-0 grow-0 pt-4 md:pt-10'>
                    <Footer />
                  </div>
                </Suspense>
              </Providers>
            </MantineProvider>
          </body>
        </html>
      </SessionProvider>
    </ViewTransitions>
  )
}
