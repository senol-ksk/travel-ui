'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Button, Drawer, Burger, NavLink, Box, Anchor } from '@mantine/core'
import { FaRegUserCircle } from 'react-icons/fa'

const links = [
  { href: '/', label: 'Ucak' },
  { href: '/', label: 'Otel' },
  { href: '/', label: 'Arac' },
  { href: '/', label: 'Otobus' },
  { href: '/', label: 'Transfer' },
  { href: '/', label: 'Tur' },
]

export const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const toggleDrawer = () => setDrawerOpened((prev) => !prev)
  return (
    <header className='border-b bg-white shadow-xs'>
      <div className='container mx-auto flex items-center py-4'>
        <Link href='/'>
          <Image
            src='/logo.png'
            width={152}
            height={41}
            alt='Fulltrip'
            priority
            style={{ width: 152, height: 41 }}
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
            {links.map((item, index) => (
              <Anchor component={Link} href={item.href} key={index} c={'dark'}>
                {item.label}
              </Anchor>
            ))}
          </div>
          <div className='ms-auto flex items-center gap-2'>
            <Anchor component={Link} href='/' c={'dark'}>
              Kampanyalar
            </Anchor>
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
            {links.map((item, index) => (
              <div key={index}>
                <Anchor component={Link} href={item.href} c={'dark'}>
                  {item.label}
                </Anchor>
              </div>
            ))}
          </div>
        </Drawer>
      </div>
    </header>
  )
}

export default Header
