import React, { useState } from 'react'
import { Drawer, Button } from '@mantine/core'

function HotelDrawers() {
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
        opened={opened}
        onClose={handleClose}
        className='flex justify-start border-gray-300 p-3'
      >
        {activeDrawer === 1 && <div>Plaj ve Havuz</div>}
        {activeDrawer === 2 && <div> Kampanyalar ve Avantajlar</div>}
      </Drawer>
    </div>
  )
}

export { HotelDrawers }
