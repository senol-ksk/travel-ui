import '@/styles/global.css'

import type { Metadata } from 'next'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'

import { Providers } from '@/app/providers'

import Header from '@/components/header'
import { theme } from '@/theme'

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
    <html lang='tr' data-mantine-color-scheme='light'>
      <head>
        <ColorSchemeScript />
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>

      <body className='antialiased'>
        <Providers>
          <MantineProvider theme={theme}>
            <Header />
            <main>{children}</main>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}
