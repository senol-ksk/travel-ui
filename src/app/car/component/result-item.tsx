import { Image, rem, Skeleton, Transition } from '@mantine/core'
import { Button, Title } from '@mantine/core'

import { PiImageBroken } from 'react-icons/pi'
import {
  MdAirlineSeatReclineNormal,
  MdElectricalServices,
  MdOutlineAccountBalanceWallet,
  MdOutlineChevronRight,
} from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import { useState } from 'react'
import { BiTachometer } from 'react-icons/bi'
import dayjs from 'dayjs'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { LuFuel } from 'react-icons/lu'

import { CarSearchResultItemType } from '@/app/car/types'
import { formatCurrency } from '@/libs/util'

import { FuelTypes } from '@/modules/carrent/types'
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
    <div
      className='cursor-pointer rounded-lg border border-gray-300 shadow'
      onClick={() => onSelect(item)}
    >
      {/* WEB GÖRÜNÜMÜ*/}
      <div>
        <div className='hidden gap-4 p-4 md:grid md:grid-cols-10'>
          {/* Araç görseli */}
          <div className='col-span-3 flex items-center justify-center'>
            {item.carDetail.imageUrl ? (
              <div className='relative'>
                <Transition
                  mounted={isImageLoading}
                  transition='fade'
                  duration={400}
                >
                  {(styles) => (
                    <div
                      style={styles}
                      className='absolute inset-0 rounded-md border bg-white p-2 transition-opacity'
                    >
                      <Skeleton className='size-full' radius='md' />
                    </div>
                  )}
                </Transition>
                <Image
                  loading='lazy'
                  src={item.carDetail.imageUrl}
                  alt={item.carDetail.name}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            ) : (
              <PiImageBroken size={70} />
            )}
          </div>

          {/* Bilgiler */}
          <div className='col-span-4'>
            <div className='flex items-center gap-2'>
              <Title order={3} className='text-xl' lh='sm'>
                {item.carDetail.name}
              </Title>
              <div className='text-sm'>({item.carDetail.category})</div>
            </div>
            <div className='grid gap-2 pt-2 text-sm'>
              <div className='flex gap-4'>
                <div className='flex items-center gap-1'>
                  {item.carDetail.fuelType === FuelTypes['Elektirikli'] ? (
                    <MdElectricalServices />
                  ) : (
                    <LuFuel />
                  )}
                  <div>{FuelTypes[item.carDetail.fuelType]}</div>
                </div>
                <div className='flex items-center gap-1'>
                  <TbManualGearbox />
                  <div>
                    {item.carDetail.automaticTransmission
                      ? 'Otomatik Vites'
                      : 'Düz Vites'}
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <MdAirlineSeatReclineNormal />
                  <div>{item.carDetail.seatCount} koltuk</div>
                </div>
              </div>

              {item.carDetail.deposit.value > 0 && (
                <div className='flex items-center gap-2'>
                  <MdOutlineAccountBalanceWallet />
                  Depozito:
                  <span className='font-semibold'>
                    {formatCurrency(item.carDetail.deposit.value)}
                  </span>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <BiTachometer />
                Toplam Km sınır:
                <span className='font-semibold'>
                  {item.carDetail.kminCluded || 'Belirtilmemiş'}
                </span>
              </div>

              <div className='flex items-center gap-1 text-green-800'>
                <IoIosCheckmarkCircle size={15} />
                <span className='font-semibold'>Ücretsiz İptal</span>
              </div>
            </div>
          </div>

          {/* Fiyat bilgisi */}
          <div className='col-span-3 my-2 text-end'>
            <div className='text-sm'>{dayCount} günlük fiyat</div>
            <div className='my-1 text-2xl font-semibold'>
              {formatCurrency(item.totalPrice.value)}
            </div>
            <div className='text-xs'>
              Günlük fiyat: {formatCurrency(item.basePrice.value)}
            </div>
          </div>
        </div>

        {/* Web: Alt teslim yeri + buton */}
        <div className='hidden items-center justify-between border-t p-4 md:flex'>
          <div className='flex items-center gap-3'>
            <Image
              src={item.carDetail.vendorUrl}
              w={rem(70)}
              alt={item.carDetail.vendorName}
            />
            <div className='text-sm'>
              Araç teslim yeri:{' '}
              <span className='font-semibold text-blue-800'>
                {item.pickupStation?.location.name}
              </span>
            </div>
          </div>
          <Button
            size='md'
            radius='md'
            rightSection={<MdOutlineChevronRight />}
          >
            Hemen Kirala
          </Button>
        </div>
      </div>
      {/*  MOBİL GÖRÜNÜM  */}
      <div>
        <div className='grid grid-cols-7 gap-3 p-3 md:hidden'>
          {/* Bilgiler */}
          <div className='col-span-4'>
            <Title order={3} className='text-xl' lh='sm'>
              {item.carDetail.name}
            </Title>
            <div className='text-sm'>{item.carDetail.category}</div>

            <div className='grid gap-2 pt-2 text-sm'>
              <div className='flex items-center gap-1'>
                {item.carDetail.fuelType === FuelTypes['Elektirikli'] ? (
                  <MdElectricalServices />
                ) : (
                  <LuFuel />
                )}
                <div>{FuelTypes[item.carDetail.fuelType]}</div>
              </div>
              <div className='flex items-center gap-1'>
                <TbManualGearbox />
                <div>
                  {item.carDetail.automaticTransmission
                    ? 'Otomatik Vites'
                    : 'Düz Vites'}
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <MdAirlineSeatReclineNormal />
                <div>{item.carDetail.seatCount} koltuk</div>
              </div>

              {item.carDetail.deposit.value > 0 && (
                <div className='flex items-center gap-1'>
                  <MdOutlineAccountBalanceWallet />
                  Depozito:
                  <span className='font-semibold'>
                    {formatCurrency(item.carDetail.deposit.value)}
                  </span>
                </div>
              )}

              <div className='flex items-center gap-1'>
                <BiTachometer />
                Toplam Km sınır:
                <span className='font-semibold'>
                  {item.carDetail.kminCluded || 'Belirtilmemiş'}
                </span>
              </div>

              <div className='flex items-center gap-1 text-green-800'>
                <IoIosCheckmarkCircle size={15} />
                <span className='font-semibold'>Ücretsiz İptal</span>
              </div>
            </div>
          </div>

          {/* Görsel */}
          <div className='col-span-3 flex items-center justify-center'>
            {item.carDetail.imageUrl ? (
              <div className='relative'>
                <Transition
                  mounted={isImageLoading}
                  transition='fade'
                  duration={400}
                >
                  {(styles) => (
                    <div
                      style={styles}
                      className='absolute inset-0 rounded-md border bg-white p-2 transition-opacity'
                    >
                      <Skeleton className='size-full' radius='md' />
                    </div>
                  )}
                </Transition>
                <Image
                  loading='lazy'
                  src={item.carDetail.imageUrl}
                  alt={item.carDetail.name}
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            ) : (
              <PiImageBroken size={70} />
            )}
          </div>
        </div>

        {/* Mobil: Araç teslim yeri */}
        <div className='flex items-center gap-2 p-3 text-xs md:hidden'>
          <Image
            src={item.carDetail.vendorUrl}
            w={rem(60)}
            alt={item.carDetail.vendorName}
          />
          <div>
            Araç teslim yeri:{' '}
            <span className='font-semibold text-blue-800'>
              {item.pickupStation?.location.name}
            </span>
          </div>
        </div>

        {/* Mobil: Fiyat ve Buton */}
        <div className='grid grid-cols-6 items-center gap-3 border-t p-3 md:hidden'>
          <div className='col-span-3'>
            <div className='text-sm'>{dayCount} günlük fiyat</div>
            <div className='text-xl font-semibold'>
              {formatCurrency(item.totalPrice.value)}
            </div>
            <div className='text-sm'>
              Günlük fiyat: {formatCurrency(item.basePrice.value)}
            </div>
          </div>
          <div className='col-span-3 flex justify-end'>
            <Button
              size='md'
              radius='md'
              onClick={() => onSelect(item)}
              rightSection={<MdOutlineChevronRight />}
              fullWidth
            >
              Hemen Kirala
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
