'use client'
import PersonLetters from '../../_components/person-letters'
import AccountSideNav from '../../_components/side-nav'
import { Button, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export default function ClientAccountLayout() {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <div className='sticky top-0 col-span-2 hidden flex-col gap-2 md:flex'>
        <div>
          <PersonLetters />
        </div>
        <div className='rounded-md border p-2 shadow'>
          <AccountSideNav />
        </div>
      </div>
      <Drawer opened={opened} onClose={close}>
        <div className='sticky top-0 col-span-2 flex flex-col gap-2 md:hidden'>
          <div>
            <PersonLetters />
          </div>
          <div className='rounded-md border p-2 shadow'>
            <AccountSideNav />
          </div>
        </div>
      </Drawer>
      <Button className='mb-5 md:hidden' onClick={open}>
        Kullanıcı Menüsü
      </Button>
    </>
  )
}
