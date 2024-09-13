'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button, Drawer, Burger } from '@mantine/core'
import { FaRegUserCircle } from 'react-icons/fa'

export const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const toggleDrawer = () => setDrawerOpened((prev) => !prev)
  return (
    <header className='bg-white'>
      <div className='container mx-auto flex items-center p-2'>
        <Link href='/'>
          <Image
            src='/logo.png'
            width={152}
            height={41}
            alt='Fulltrip'
            priority
          />
        </Link>

        <div className='ml-auto md:hidden'>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            size='sm'
            title='Menü Aç/Kapat'
          />
        </div>

        <div className='hidden flex-1 items-center md:flex'>
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
              variant='outline'
              className='flex gap-3'
              radius='xl'
              leftSection={<FaRegUserCircle />}
            >
              Hesabım
            </Button>
          </div>
        </div>

        <Drawer
          opened={drawerOpened}
          onClose={toggleDrawer}
          title='Menü'
          padding='md'
          size='sm'
        >
          <Button
            type='button'
            variant='outline'
            className='mb-5 flex gap-3'
            radius='xl'
            leftSection={<FaRegUserCircle />}
          >
            Hesabım
          </Button>

          <div className='flex flex-col gap-4'>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Otel
              </Link>
            </div>
            <div className='w-full'>
              <Link
                href='/'
                className='border-gray selection: block rounded border p-3'
              >
                Uçak
              </Link>
            </div>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Araç
              </Link>
            </div>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Otobüs
              </Link>
            </div>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Transfer
              </Link>
            </div>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Tur
              </Link>
            </div>
            <div className='w-full'>
              <Link href='/' className='border-gray block rounded border p-3'>
                Kampanyalar
              </Link>
            </div>
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export default Header
