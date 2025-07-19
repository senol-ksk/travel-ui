'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { useSession, signOut } from 'next-auth/react'
import {
  Button,
  Drawer,
  Burger,
  Anchor,
  Container,
  Skeleton,
  Menu,
  ActionIcon,
  Box,
  UnstyledButton,
} from '@mantine/core'
import { FaRegUserCircle } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import { IoIosLogOut } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'

export const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false)
  const toggleDrawer = () => setDrawerOpened((prev) => !prev)
  const session = useSession()

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
        <Box className='flex items-center py-4'>
          <Link href='/'>
            <Image
              src='/logo.png'
              width={118}
              height={41}
              alt='Paraflytravel'
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

          <Box className='hidden flex-1 items-center md:flex'>
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
                  <div key={item.id}>
                    <Link
                      className='rounded p-2 hover:bg-blue-50'
                      href={item.url}
                      prefetch={false}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              )}
            </div>
            {/* <Anchor component={Link} href='/kampanyalar'>
              Kampanyalar
            </Anchor> */}
            <div className='ms-auto flex items-center gap-5'>
              <Menu>
                <Menu.Target>
                  <UnstyledButton className='flex items-center gap-2'>
                    <div>Online İşlemler</div>
                    <div>
                      <IoIosArrowDown />
                    </div>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href='/online-operations'>
                    Seyahatinizi Görüntüleyin
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href='/online-operations/cancel-flight'
                  >
                    Uçak İptal İade
                  </Menu.Item>
                  <Menu.Item component={Link} href='/online-operations/checkin'>
                    Online Check-in
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {/* Parafly alanı */}
              <Menu>
                <Menu.Target>
                  <UnstyledButton className='flex items-center gap-2'>
                    <div>Parafly</div>
                    <div>
                      <IoIosArrowDown />
                    </div>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href='/parafly/bonus-query'>
                    ParafPara Sorgula
                  </Menu.Item>
                  <Menu.Item component={Link} href='/parafly/calculate'>
                    ParafPara Hesapla
                  </Menu.Item>
                  <Menu.Item component={Link} href='/parafly/about'>
                    Parafly Travel Nedir?
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {session.status === 'authenticated' ? (
                <Menu>
                  <Menu.Target>
                    <ActionIcon
                      variant='subtle'
                      radius='xl'
                      // leftSection={<FaRegUserCircle />}
                    >
                      {/* <span className='block max-w-20 truncate'>
                        {session.data?.user.name}
                      </span> */}
                      <FaRegUserCircle size={22} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>{session.data?.user.name}</Menu.Label>
                    <Menu.Item component={Link} href={'/account/'}>
                      Hesabım
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => signOut()}
                      className='text-red-500'
                      leftSection={<IoIosLogOut size={18} />}
                    >
                      Oturumu Kapatın
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button
                  variant='outline'
                  radius='xl'
                  leftSection={<FaRegUserCircle />}
                  component={Link}
                  href={'/auth/login'}
                  loading={session.status === 'loading'}
                >
                  Oturum Açın
                </Button>
              )}
            </div>
          </Box>

          <Drawer
            opened={drawerOpened}
            onClose={toggleDrawer}
            title='Menü'
            padding='md'
            size='sm'
          >
            <div>
              {session.status === 'authenticated' ? (
                <Button
                  variant='outline'
                  radius='xl'
                  leftSection={<FaRegUserCircle />}
                  component={Link}
                  href={'/account/'}
                >
                  <span className='block max-w-20 truncate'>
                    {session.data?.user.name}
                  </span>
                </Button>
              ) : (
                <Button
                  variant='outline'
                  radius='xl'
                  leftSection={<FaRegUserCircle />}
                  component={Link}
                  href={'/auth/login'}
                  loading={session.status === 'loading'}
                >
                  Giriş Yap
                </Button>
              )}
            </div>

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
        </Box>
      </Container>
    </header>
  )
}

export default Header
