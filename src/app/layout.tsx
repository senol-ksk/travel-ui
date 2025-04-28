import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'

import '@/styles/global.css'

import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { ViewTransitions } from 'next-view-transitions'

import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

import { Red_Hat_Text } from 'next/font/google'
import { Providers } from '@/app/providers'
import { mantineTheme } from '@/styles/mantine'

import Header from '@/components/header'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Notifications } from '@mantine/notifications'

const red_hat_text = Red_Hat_Text({
  variable: '--font-red-hat-text',
})

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
        <html
          lang='tr'
          {...mantineHtmlProps}
          className={`${red_hat_text.variable}`}
        >
          <head>
            <link rel='icon' href='/favicon.ico' sizes='any' />
            <ColorSchemeScript />
          </head>

          <body className='flex flex-col'>
            <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
              <Providers>
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
              </Providers>
            </MantineProvider>
          </body>
        </html>
      </SessionProvider>
    </ViewTransitions>
  )
}
