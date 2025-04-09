import { ActionIcon, Button, Card, Popover, Title } from '@mantine/core'
import { RiDeleteBin5Line, RiEditLine } from 'react-icons/ri'
import { SavePassengerServiceResponse } from '../types'
import { useClickOutside, useDisclosure } from '@mantine/hooks'

type IProps = {
  passenger: SavePassengerServiceResponse
  onDelete?: () => void
  onSelect?: () => void
  isDeleting?: boolean
}

export const SavedPassengerItem: React.FC<IProps> = ({
  passenger,
  onDelete = () => null,
  isDeleting = false,
  onSelect = () => null,
}) => {
  const fullName = `${passenger.firstName} ${passenger.lastName}`
  const [openedPopover, { open: openPopover, close: closePopover }] =
    useDisclosure(false)
  const ref = useClickOutside(closePopover)

  return (
    <Card withBorder shadow='xs'>
      <div className='flex justify-between gap-3'>
        <Title order={6} className='leading-sm flex items-center gap-2'>
          <span>{fullName}</span>
          <small className='font-normal text-gray-600'>{passenger.email}</small>
        </Title>
        <div className='ms-auto flex gap-2'>
          <Popover withArrow withOverlay width={200} opened={openedPopover}>
            <Popover.Target>
              <ActionIcon color='red' size={'sm'} onClick={openPopover}>
                <RiDeleteBin5Line />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown ref={ref}>
              <div>
                <div className='text-sm'>
                  <strong className='underline'>{fullName}</strong> adlı yolcuyu
                  silmek istediğinizden emin misiniz?
                </div>
                <div className='flex justify-center gap-3 pt-3'>
                  <Button
                    size='xs'
                    color='red'
                    onClick={onDelete}
                    loading={isDeleting}
                  >
                    Evet
                  </Button>
                  <Button size='xs' color='green' onClick={closePopover}>
                    Vaz geç
                  </Button>
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>
          <ActionIcon size={'sm'} onClick={onSelect}>
            <RiEditLine />
          </ActionIcon>
        </div>
      </div>
    </Card>
  )
}
