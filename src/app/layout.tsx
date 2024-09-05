import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FaRegUserCircle } from 'react-icons/fa'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

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
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <header className='bg-white'>
          <div className='container mx-auto flex items-center p-2'>
            {/* <Link href='/'>
              <Image
                src='/logo.png'
                width={152}
                height={41}
                alt='Fulltrip'
                priority
              />
            </Link>
            
            
            
            
            
            */}

            <div className='flex flex-1 items-center'>
              <div className='flex gap-2 px-3 md:gap-4 md:px-5'>
                <Link href='/'>Otel</Link>
                <Link href='/'>Uçak</Link>
                <Link href='/'>Araç</Link>
                <Link href='/'>Otobüs</Link>
                <Link href='/'>Transfer</Link>
                <Link href='/'>Tur</Link>
              </div>
              <div className='ms-auto flex items-center gap-2'>
                <Link href='/'>Kampanyalar</Link>
                <Button
                  type='button'
                  variant={'outlinePill'}
                  className='flex gap-2'
                >
                  <FaRegUserCircle />
                  <span>Hesabım</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className='flex-shrink flex-grow'>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  )
}
