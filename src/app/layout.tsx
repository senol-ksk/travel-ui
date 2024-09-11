import '@/styles/global.css'

import type { Metadata } from 'next'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Providers } from '@/app/providers'

import Header from '@/components/header'
import { theme } from '@/theme'

export const metadata: Metadata = {
  title: 'Fulltrip',
  description: `Seyahat planı yapmadan biraz ilham almaya ne dersiniz? Seyahatin 'En İyilerini' sizin için topluyoruz.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr'>
      <head>
        <ColorSchemeScript />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' sizes='any' />
      </head>

      <body>
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
