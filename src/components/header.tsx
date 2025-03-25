'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'

import {
  Button,
  Drawer,
  Burger,
  Anchor,
  Container,
  Skeleton,
} from '@mantine/core'
import { FaRegUserCircle } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getWidgetsByCollectionSlug } from '@/libs/cms-data'

export const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const toggleDrawer = () => setDrawerOpened((prev) => !prev)

  const headerData = useQuery({
    queryKey: ['header-cms-data'],
    queryFn: async () => {
      const response = await getWidgetsByCollectionSlug()
      return response?.data
    },
    select(data) {
      const headerData = data?.find((item) => item.point === 'header')
      return headerData
    },
  })

  return (
    <header className='border-b bg-white'>
      <Container>
        <div className='flex items-center py-4'>
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
            <div className='flex items-center gap-2 px-3 md:gap-4 md:px-5'>
              {headerData.isLoading ? (
                <div className='flex gap-2'>
                  <Skeleton h={20} className='size-20 grow' />
                  <Skeleton h={20} className='size-20 grow' />
                  <Skeleton h={20} className='size-20 grow' />
                </div>
              ) : (
                headerData.data &&
                headerData.data?.params.main_menu.menus.map((item) => (
                  <Anchor
                    component={Link}
                    href={item.url}
                    key={item.id}
                    c={'dark'}
                  >
                    {item.title}
                  </Anchor>
                ))
              )}
            </div>
            <div className='ms-auto flex items-center gap-2'>
              <Anchor component={Link} href='/kampanyalar' c={'dark'}>
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
              {headerData.data &&
                headerData.data?.params.main_menu.menus.map((item) => (
                  <Anchor
                    component={Link}
                    href={item.url}
                    key={item.id}
                    c={'dark'}
                  >
                    {item.title}
                  </Anchor>
                ))}
            </div>
          </Drawer>
        </div>
      </Container>
    </header>
  )
}

export default Header
