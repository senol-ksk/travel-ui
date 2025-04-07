import { ActionIcon, Button, Popover, Title } from '@mantine/core'
import { SavedInvoicesResponse } from '../types'
import { RiDeleteBin5Line, RiEditLine } from 'react-icons/ri'
import { useState } from 'react'
import { useClickOutside } from '@mantine/hooks'

type IProps = {
  invoice: SavedInvoicesResponse
  onDelete: () => void
}

const SaveInvoiceCard: React.FC<IProps> = ({ invoice, onDelete }) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const ref = useClickOutside(() => setIsPopoverVisible(false))

  return (
    <div className='rounded border p-3'>
      <Title order={5}>{invoice.billingInfoName}</Title>
      <div>{invoice.fullName}</div>
      <div className='flex justify-end gap-2 pt-4'>
        <Popover withArrow opened={isPopoverVisible} width={250} withOverlay>
          <Popover.Target>
            <ActionIcon
              color='red'
              size={'sm'}
              onClick={() => setIsPopoverVisible((o) => !o)}
            >
              <RiDeleteBin5Line />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown ref={ref}>
            <div>
              <div>
                <b className='underline'>{invoice.billingInfoName}</b> isimli
                fatura kaydınızı silmek istediğinizden emin misiniz?
              </div>
              <div className='flex justify-center gap-4 pt-4'>
                <Button color='red' size='compact-sm' onClick={onDelete}>
                  Evet
                </Button>
                <Button
                  onClick={() => setIsPopoverVisible(false)}
                  size='compact-sm'
                >
                  Vaz geç
                </Button>
              </div>
            </div>
          </Popover.Dropdown>
        </Popover>
        <ActionIcon size={'sm'}>
          <RiEditLine />
        </ActionIcon>
      </div>
    </div>
  )
}

export { SaveInvoiceCard }
