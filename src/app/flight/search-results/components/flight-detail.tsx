import { useDisclosure } from '@mantine/hooks'
import { Drawer, Button } from '@mantine/core'

const FlightDetailsSearch = () => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer
        position='right'
        opened={opened}
        onClose={close}
        title='Uçuş Detayları'
        padding='xl'
        size='xl'
      >
        <p>Uçuş Detayları</p>
      </Drawer>

      <Button variant='transparent' fw={'normal'} onClick={open}>
        Uçuş Detayları
      </Button>
    </>
  )
}

export { FlightDetailsSearch }
