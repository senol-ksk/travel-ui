import { Image, Skeleton } from '@mantine/core'
import { Button, Title } from '@mantine/core'
import { IoArrowForward } from 'react-icons/io5'

import { CarSearchResultItemType } from '@/app/car/types'
import { formatCurrency } from '@/libs/util'
import { PiImageBroken } from 'react-icons/pi'

type Props = {
  item: CarSearchResultItemType
  onSelect: (car: CarSearchResultItemType) => void
}

export const CarSearchResultItem: React.FC<Props> = ({ item, onSelect }) => {
  return (
    <div className='rounded-lg border border-gray-300'>
      <div className='grid gap-3 p-3 md:grid-cols-12 md:p-4'>
        <div className='grid items-center justify-center md:col-span-3'>
          {item.carDetail.imageUrl ? (
            <div>
              <Image src={item.carDetail.imageUrl} alt={item.carDetail.name} />
            </div>
          ) : (
            <div>
              <PiImageBroken size={70} />
            </div>
          )}
        </div>
        <div className='col-span-7'>
          <Title order={3} className='text-xl'>
            {item.carDetail.name}
            <small className='text-sm font-normal'>
              {' '}
              - {item.carDetail.category}
            </small>
          </Title>
        </div>
        <div className='col-span-2 grid'>
          <div className='text-end'>
            <div className='text-xl font-semibold'>
              {formatCurrency(item.totalPrice.value)}
            </div>
            <div className='text-sm text-gray-600'>
              {formatCurrency(item.basePrice.value)} / Günlük
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-end justify-end border-t p-3 md:p-4'>
        <Button
          onClick={() => onSelect(item)}
          rightSection={<IoArrowForward />}
        >
          Hemen Kirala
        </Button>
      </div>
    </div>
  )
}
