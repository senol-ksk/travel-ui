import { Image, rem, Skeleton, Transition } from '@mantine/core'
import { Button, Title } from '@mantine/core'

import { IoArrowForward } from 'react-icons/io5'
import { PiImageBroken } from 'react-icons/pi'
import {
  MdAirlineSeatReclineNormal,
  MdElectricalServices,
} from 'react-icons/md'
import { TbManualGearboxFilled } from 'react-icons/tb'

import { CarSearchResultItemType } from '@/app/car/types'
import { formatCurrency } from '@/libs/util'
import { useState } from 'react'
import { BsFuelPump } from 'react-icons/bs'
import { FuelTypes } from '@/modules/carrent/types'

type Props = {
  item: CarSearchResultItemType
  onSelect: (car: CarSearchResultItemType) => void
}

export const CarSearchResultItem: React.FC<Props> = ({ item, onSelect }) => {
  const [isImageLoading, setImageLoading] = useState(true)

  return (
    <div className='rounded-lg border border-gray-300'>
      <div className='grid gap-3 p-3 md:grid-cols-12 md:p-4'>
        <div className='grid items-center justify-center md:col-span-3'>
          {item.carDetail.imageUrl ? (
            <div className='relative'>
              <Transition
                mounted={isImageLoading}
                transition='fade'
                duration={400}
                timingFunction='ease'
              >
                {(styles) => (
                  <div
                    style={styles}
                    className='absolute start-0 end-0 top-0 bottom-0 rounded-md border bg-white p-2 transition-opacity duration-300'
                  >
                    <Skeleton className='size-full' radius={'md'} />
                  </div>
                )}
              </Transition>
              <Image
                loading='lazy'
                src={item.carDetail.imageUrl}
                alt={item.carDetail.name}
                onLoad={(e) => {
                  setImageLoading(false)
                }}
              />
            </div>
          ) : (
            <div>
              <PiImageBroken size={70} />
            </div>
          )}
        </div>
        <div className='col-span-6'>
          <Title order={3} className='text-xl'>
            {item.carDetail.name}
            <small className='text-sm font-normal'>
              {' '}
              - {item.carDetail.category}
            </small>
          </Title>
          <div className='grid grid-cols-3 gap-3 pt-2 text-xs text-gray-600'>
            <div className='flex items-center gap-2'>
              <div>
                {item.carDetail.fuelType === FuelTypes['Elektirikli'] ? (
                  <MdElectricalServices />
                ) : (
                  <BsFuelPump />
                )}
              </div>
              <div>{FuelTypes[item.carDetail.fuelType]}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <TbManualGearboxFilled />
              </div>
              <div>
                {item.carDetail.automaticTransmission
                  ? 'Otomatik Vites'
                  : 'Düz Vites'}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <MdAirlineSeatReclineNormal />
              </div>
              <div>{item.carDetail.seatCount}</div>
            </div>
          </div>
        </div>
        <div className='col-span-3 grid'>
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
      <div className='flex justify-between border-t p-3 md:p-4'>
        <div>
          <Image
            src={item.carDetail.vendorUrl}
            w={rem(70)}
            alt={item.carDetail.vendorName}
          />
        </div>
        <div>
          <Button
            onClick={() => onSelect(item)}
            rightSection={<IoArrowForward />}
          >
            Hemen Kirala
          </Button>
        </div>
      </div>
    </div>
  )
}
