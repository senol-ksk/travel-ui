import React, { useState } from 'react'
import { Drawer, Button, Title } from '@mantine/core'
import { HotelDetailDescription } from '@/app/hotel/types'

type IProps = {
  description: HotelDetailDescription
}

const HotelDrawers: React.FC<IProps> = ({ description }) => {
  const [opened, setOpened] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<number | null>(null)

  const handleDrawerOpen = (drawerNumber: number) => {
    setActiveDrawer(drawerNumber)
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
    setActiveDrawer(null)
  }

  return (
    <div className='grid gap-3'>
      <div
        className='cursor-pointer rounded border border-gray-300 p-3'
        onClick={() => handleDrawerOpen(1)}
      >
        <Button
          variant='white'
          color='black'
          size='md'
          radius='md'
          className='flex justify-start'
        >
          Plaj ve havuz
        </Button>
      </div>
      <div
        className='cursor-pointer rounded border border-gray-300 p-3'
        onClick={() => handleDrawerOpen(2)}
      >
        <Button
          variant='white'
          color='black'
          size='md'
          radius='md'
          className='flex justify-start'
        >
          Kampanyalar ve Avantajlar
        </Button>
      </div>

      <Drawer
        position='right'
        size='xl'
        opened={opened && activeDrawer === 1}
        onClose={handleClose}
        title={
          <div className='flex items-center'>
            <button
              onClick={handleClose}
              className='rounded-full bg-gray-200 p-2 text-gray-700'
            >
              ❌
            </button>
            <div className='px-5'>
              <Title className='text-center' order={3}>
                Plaj ve Havuz Bilgisi
              </Title>
            </div>
          </div>
        }
        className='border-gray-300 p-3'
        closeButtonProps={{
          style: { display: 'none' },
        }}
      >
        <hr className='mt-3 mb-3 border-blue-500' />
        <div
          dangerouslySetInnerHTML={{
            __html: description.beachPool ? description.beachPool : '',
          }}
        />
      </Drawer>

      <Drawer
        position='right'
        size='xl'
        opened={opened && activeDrawer === 2}
        onClose={handleClose}
        title={
          <div className='flex items-center'>
            <button
              onClick={handleClose}
              className='rounded-full bg-gray-200 p-2 text-gray-700'
            >
              ❌
            </button>
            <div className='px-5'>
              <Title className='text-center' order={3}>
                Kampanyalar ve Avantajlar
              </Title>
            </div>
          </div>
        }
        className='border-gray-300 p-3'
        closeButtonProps={{
          style: { display: 'none' },
        }}
      >
        <hr className='mt-3 mb-3 border-blue-500' />
        <div
        // dangerouslySetInnerHTML={{
        //   __html: description.promotions ? description.promotions : '',
        // }}
        />
      </Drawer>
    </div>
  )
}

export { HotelDrawers }
