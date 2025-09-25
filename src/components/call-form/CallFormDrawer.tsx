'use client'

import { Container, Button, Drawer } from '@mantine/core'
import { MdPhone, MdPhoneInTalk } from 'react-icons/md'
import { CallForm } from '.'
import { useDisclosure } from '@mantine/hooks'

const CallFormDrawer = () => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div>
      <Container>
        <div className='fixed right-3 bottom-0 z-50 hidden items-center md:flex'>
          <Button
            variant='filled'
            onClick={open}
            size='md'
            className='bg-blue-900'
          >
            <MdPhone size={24} className='mr-1' />
            <span> Biz Sizi Arayalım</span>
          </Button>
        </div>
        <Drawer
          opened={opened}
          onClose={close}
          size={'lg'}
          title={
            <div className='mt-5 flex items-center gap-5 text-xl font-semibold'>
              <MdPhoneInTalk size={32} className='text-blue-800' />
              <span>Biz Sizi Arayalım</span>
            </div>
          }
          position='right'
        >
          {' '}
          <CallForm />
        </Drawer>
      </Container>
    </div>
  )
}

export { CallFormDrawer }
