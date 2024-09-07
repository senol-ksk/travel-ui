import '@/styles/global.css'

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import Header from '@/components/header'

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
        <MantineProvider>
          <Header />
          <main className='flex-shrink flex-grow'>{children}</main>
          <footer>Footer</footer>
        </MantineProvider>
      </body>
    </html>
  )
}
