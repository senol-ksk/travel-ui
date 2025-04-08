import { ActionIcon, Button, Popover, Title } from '@mantine/core'
import { SavedInvoicesResponse } from '../types'
import { RiDeleteBin5Line, RiEditLine } from 'react-icons/ri'
import { useState } from 'react'
import { useClickOutside } from '@mantine/hooks'
import { InvoiceType } from '@/types/global'

type IProps = {
  invoice: SavedInvoicesResponse
  onDelete: () => void
  onEdit: () => void
  isDeleting?: boolean
}

const SaveInvoiceCard: React.FC<IProps> = ({
  invoice,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const ref = useClickOutside(() => setIsPopoverVisible(false))

  return (
    <div className='rounded border p-3'>
      <Title order={5}>{invoice.billingInfoName}</Title>
      <div>
        {invoice.type === +InvoiceType.Individual
          ? invoice.fullName
          : invoice.title}
      </div>
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
                <Button
                  color='red'
                  size='compact-sm'
                  onClick={onDelete}
                  loading={isDeleting}
                >
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
        <ActionIcon size={'sm'} onClick={onEdit}>
          <RiEditLine />
        </ActionIcon>
      </div>
    </div>
  )
}

export { SaveInvoiceCard }
