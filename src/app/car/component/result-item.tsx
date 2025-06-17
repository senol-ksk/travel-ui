import { Image, rem, Skeleton, Transition } from '@mantine/core'
import { Button, Title } from '@mantine/core'

import { IoArrowForward } from 'react-icons/io5'
import { PiImageBroken } from 'react-icons/pi'
import {
  MdAirlineSeatReclineNormal,
  MdElectricalServices,
  MdOutlineAccountBalanceWallet,
} from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'

import { CarSearchResultItemType } from '@/app/car/types'
import { formatCurrency } from '@/libs/util'
import { useState } from 'react'

import { FuelTypes } from '@/modules/carrent/types'
import { BiTachometer } from 'react-icons/bi'
import dayjs from 'dayjs'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { LuFuel } from 'react-icons/lu'

type Props = {
  item: CarSearchResultItemType
  onSelect: (car: CarSearchResultItemType) => void
}

export const CarSearchResultItem: React.FC<Props> = ({ item, onSelect }) => {
  const [isImageLoading, setImageLoading] = useState(true)
  const dayCount = dayjs(item.carDetail.returnDate).diff(
    item.carDetail.pickupDate,
    'day'
  )

  return (
    <div className='rounded-lg border border-gray-300 shadow'>
      <div className='grid gap-3 p-3 md:grid-cols-12 md:p-4'>
        <div className='col-span-6 grid items-center justify-center md:col-span-3'>
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
          <div>
            <Title order={3} className='text-xl' lh={'sm'}>
              {item.carDetail.name}
            </Title>
            <div className='text-sm'>{item.carDetail.category}</div>
          </div>
          <div className='grid gap-2 text-sm'>
            <div className='flex gap-3 pt-2'>
              <div className='flex items-center gap-2'>
                <div>
                  {item.carDetail.fuelType === FuelTypes['Elektirikli'] ? (
                    <MdElectricalServices />
                  ) : (
                    <LuFuel />
                  )}
                </div>
                <div>{FuelTypes[item.carDetail.fuelType]}</div>
              </div>
              <div className='flex items-center gap-2'>
                <div>
                  <TbManualGearbox />
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

            {item.carDetail.deposit.value > 0 && (
              <div className='flex items-center gap-2'>
                <div>
                  <MdOutlineAccountBalanceWallet />
                </div>
                Depozito:
                <span className='font-semibold'>
                  {formatCurrency(item.carDetail.deposit.value)}
                </span>
              </div>
            )}

            <div className='flex items-center gap-2'>
              <div>
                <BiTachometer />
              </div>
              Toplam Km sınır:
              <span className='font-semibold'>
                {item.carDetail.kminCluded
                  ? item.carDetail.kminCluded
                  : 'Belirtilmemiş'}
              </span>
            </div>
          </div>
        </div>
        <div className='col-span-6 grid md:col-span-3'>
          <div className='text-end'>
            <div className='text-sm'>{dayCount} günlük fiyat</div>
            <div className='text-xl font-semibold'>
              {formatCurrency(item.totalPrice.value)}
            </div>
            <div className='text-sm'>
              Günlük fiyat: {formatCurrency(item.basePrice.value)}
            </div>
            <div className='flex items-center justify-end gap-2 pt-2 text-green-800'>
              <div>
                <IoIosCheckmarkCircle />
              </div>
              <div>Ücretsiz iptal</div>
            </div>
          </div>
        </div>
      </div>
      <div className='block items-center justify-between border-t p-3 md:flex md:p-4'>
        <div className='flex items-center gap-3 pb-3 md:pb-0'>
          <div>
            <Image
              src={item.carDetail.vendorUrl}
              w={rem(70)}
              alt={item.carDetail.vendorName}
            />
          </div>
          <div className='text-sm'>
            Araç teslim yeri:{' '}
            <span className='font-semibold text-blue-800'>
              {item.pickupStation?.location.name}
            </span>{' '}
          </div>
        </div>
        <div>
          <Button
            onClick={() => onSelect(item)}
            rightSection={<IoArrowForward />}
            fullWidth
          >
            Hemen Kirala
          </Button>
        </div>
      </div>
    </div>
  )
}
