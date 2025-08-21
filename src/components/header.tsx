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
  Box,
  UnstyledButton,
  Grid,
} from '@mantine/core'
import { FaRegUserCircle, FaUser } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import { IoIosLogOut } from 'react-icons/io'
import { IoIosArrowDown } from 'react-icons/io'
import PersonLetters from '@/app/account/_components/person-letters'
import AccountSideNav from '@/app/account/_components/side-nav'
import { useDisclosure } from '@mantine/hooks'
import { FaBed } from 'react-icons/fa'
import { MdAirplanemodeActive } from 'react-icons/md'
import { FaCar } from 'react-icons/fa6'
import { FaBusSimple } from 'react-icons/fa6'
import { BsLuggageFill } from 'react-icons/bs'
import { TbArrowsRightLeft } from 'react-icons/tb'
import { modals } from '@mantine/modals'
import { LoginForm } from '@/app/auth/login/_components/login-form'
import { Route } from 'next'

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
  const [opened, { open, close }] = useDisclosure(false)
  const iconMap = {
    Otel: FaBed,
    Uçak: MdAirplanemodeActive,
    Araç: FaCar,
    Tur: BsLuggageFill,
    Otobüs: FaBusSimple,
    Transfer: TbArrowsRightLeft,
  } as const
  type IconKey = keyof typeof iconMap

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
          <Drawer opened={opened} onClose={close} className='md:hidden'>
            <div className='flex flex-col gap-2'>
              <div>
                <PersonLetters />
              </div>
              <div className='rounded-md border p-2 shadow'>
                <AccountSideNav insideClose={close} />
              </div>
            </div>
          </Drawer>
          <div className='ml-auto flex items-center gap-1 md:hidden'>
            {session.status === 'authenticated' ? (
              <Button
                onClick={open}
                className='m-1 rounded-full bg-blue-800 p-2 text-start text-xs font-medium text-white'
              >
                {session?.data.user.name
                  ? `${session.data.user.name.split(' ')[0][0].toUpperCase()}${session.data.user.name.split(' ').slice(-1)[0][0].toUpperCase()}`
                  : ''}
              </Button>
            ) : (
              <Button
                variant='outline'
                size='xs'
                className='p-2'
                radius={'xl'}
                component={Link}
                href={'/auth/login'}
              >
                <FaUser />
              </Button>
            )}

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
                      href={item.url as Route}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className='ms-auto flex items-center gap-3'>
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
                    <Button
                      size='sm'
                      variant='outline'
                      leftSection={<FaUser />}
                      className='truncate rounded-lg bg-blue-800 text-start text-xs font-medium text-white'
                    >
                      {session?.data.user.name}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>{session.data?.user.name}</Menu.Label>
                    <Menu.Item component={Link} href={'/account'}>
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
                  // component={Link}
                  // href={'/auth/login'}
                  loading={session.status === 'loading'}
                  onClick={() => {
                    modals.open({
                      title: 'Giriş Yap',
                      children: <LoginForm />,
                    })
                  }}
                >
                  Oturum Açın
                </Button>
              )}
            </div>
          </Box>

          <Drawer
            opened={drawerOpened}
            onClose={toggleDrawer}
            padding='md'
            styles={{
              header: {
                borderBottom: '1px solid #eaeaea',
                boxShadow: '0 0 2px 0 gray',
                padding: '10px 20px',
              },
            }}
            title={
              <div className='gap-lg flex items-center justify-end'>
                <Link onClick={toggleDrawer} href='/'>
                  <Image
                    src='/logo.png'
                    width={118}
                    height={41}
                    alt='Paraflytravel'
                    priority
                  />
                </Link>

                <div>
                  {session.status === 'authenticated' ? (
                    <Button
                      variant='outline'
                      radius='xl'
                      onClick={toggleDrawer}
                      leftSection={<FaRegUserCircle />}
                      component={Link}
                      href={'/account'}
                    >
                      <span className='block truncate text-xs font-medium'>
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
              </div>
            }
            size='sm'
          >
            <div className='mt-4 flex flex-col gap-4'>
              {headerData.data &&
                headerData.data?.params.main_menu.menus.map((item) => {
                  const IconComponent = iconMap[item.title as IconKey]
                  return (
                    <Anchor
                      className={
                        item.title == 'Kampanyalar'
                          ? 'border-t border-gray-400 pt-4'
                          : ''
                      }
                      onClick={toggleDrawer}
                      component={Link}
                      href={item.url as Route}
                      key={item.id}
                      c={'dark'}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={18}
                          className='me-3 inline-block'
                        />
                      )}
                      {item.title}
                    </Anchor>
                  )
                })}
            </div>
            <Grid gutter={'md'} className='mt-4'>
              <Grid.Col span={12}>
                <Anchor
                  component={Link}
                  onClick={toggleDrawer}
                  href='/online-operations'
                  c={'dark'}
                >
                  Seyahatinizi Görüntüleyin
                </Anchor>
              </Grid.Col>
              <Grid.Col span={12}>
                <Anchor
                  onClick={toggleDrawer}
                  component={Link}
                  href='/online-operations/cancel-flight'
                  c={'dark'}
                >
                  Bilet İptal, İade İşlemleri
                </Anchor>
              </Grid.Col>
              <Grid.Col span={12}>
                <Anchor
                  onClick={toggleDrawer}
                  component={Link}
                  href='/online-operations/checkin'
                  c={'dark'}
                >
                  Online Check in
                </Anchor>
              </Grid.Col>
              <Grid.Col span={12}>
                <Anchor
                  onClick={toggleDrawer}
                  component={Link}
                  href='/iletisim'
                  c={'dark'}
                >
                  Yardım
                </Anchor>
              </Grid.Col>
            </Grid>
          </Drawer>
        </Box>
      </Container>
    </header>
  )
}

export default Header
