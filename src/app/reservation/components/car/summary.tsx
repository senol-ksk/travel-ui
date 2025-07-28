import { Image, rem, Skeleton, Title, Transition } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { CarSummaryResponse } from '@/app/reservation/types'
import { formatCurrency } from '@/libs/util'
import { CheckoutCard } from '@/components/card'
import { PiImageBroken } from 'react-icons/pi'
import { FuelTypes } from '@/modules/carrent/types'
import { BiTachometer } from 'react-icons/bi'
import { LuFuel } from 'react-icons/lu'
import {
  MdElectricalServices,
  MdAirlineSeatReclineNormal,
  MdOutlineAccountBalanceWallet,
  MdDescription,
} from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import { useState } from 'react'

dayjs.extend(utc)

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const CarReservationSummary: React.FC<IProps> = ({ data }) => {
  const summaryResponse = data.SummaryViewDataResponser
    .summaryResponse as CarSummaryResponse

  const responseFirstItem = summaryResponse.detailResponse.items[0]
  const carDetail = responseFirstItem.carDetail
  const selectedExtraOptions = responseFirstItem.carExtraOption.filter(
    (item) => item.selected
  )
  const selectedInsuranceOptions = responseFirstItem.carInsurances.filter(
    (item) => item.selected
  )

  const extraOptionsTotalPrice = selectedExtraOptions.reduce((a, b) => {
    return a + b.totalPrice.value
  }, 0)
  const insuranceOptionsTotalPrice = selectedInsuranceOptions.reduce((a, b) => {
    return a + b.totalPrice.value
  }, 0)

  const payAtOfficeTotalPrice =
    extraOptionsTotalPrice + insuranceOptionsTotalPrice
  const [isImageLoading, setImageLoading] = useState(true)
  return (
    <CheckoutCard>
      <div className='grid gap-3'>
        <div className='hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
          <MdDescription size={22} className='text-blue-800' />
          <div>Seyahat Özeti</div>
        </div>
        <Title order={5}>
          {carDetail.name} - <small>{carDetail.category}</small>
        </Title>
        <div>
          <div className='grid grid-cols-7 md:gap-3'>
            <div className='col-span-3 flex items-center justify-center'>
              {carDetail.imageUrl ? (
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
                    src={carDetail.imageUrl}
                    alt={carDetail.name}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
              ) : (
                <PiImageBroken size={70} />
              )}
            </div>
            <div className='col-span-4'>
              <div className='grid gap-2 pt-2 text-sm'>
                <div className='flex items-center gap-1'>
                  {carDetail.fuelType === FuelTypes['Elektirikli'] ? (
                    <MdElectricalServices />
                  ) : (
                    <LuFuel />
                  )}
                  <div>{FuelTypes[carDetail.fuelType]}</div>
                </div>
                <div className='flex items-center gap-1'>
                  <TbManualGearbox />
                  <div>
                    {carDetail.automaticTransmission
                      ? 'Otomatik Vites'
                      : 'Düz Vites'}
                  </div>
                </div>
                <div className='flex items-center gap-1'>
                  <MdAirlineSeatReclineNormal />
                  <div>{carDetail.seatCount} koltuk</div>
                </div>

                {carDetail.deposit.value > 0 && (
                  <div className='flex items-center gap-1'>
                    <MdOutlineAccountBalanceWallet />
                    Depozito:
                    <span className='font-semibold'>
                      {formatCurrency(carDetail.deposit.value)}
                    </span>
                  </div>
                )}

                <div className='flex items-center gap-1'>
                  <BiTachometer />
                  Toplam:
                  <span className='font-semibold'>
                    {carDetail.kminCluded || 'Belirtilmemiş'}
                  </span>
                  km
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 border-b py-4'>
            <Image
              src={carDetail.vendorUrl}
              w={rem(70)}
              alt={carDetail.vendorName}
            />
            <div className='text-sm'>
              Araç Alış Yeri:{' '}
              <span className='font-semibold text-blue-800'>
                {summaryResponse.pickupStation?.location.name}
              </span>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-10 border-b py-3'>
          <div className='col-span-1 my-1 flex flex-col items-center'>
            <div className='z-10 h-3 w-3 rounded-full bg-blue-800'></div>
            <div className='h-15 w-0.5 bg-blue-700'></div>
            <div className='z-10 h-3 w-3 rounded-full bg-blue-800'></div>
          </div>

          <div className='col-span-9 grid gap-3'>
            <div className='text-sm'>
              <div className='font-bold'>Teslim Alış</div>
              <div>
                {dayjs(carDetail.pickupDate).utc().format('DD MMMM YYYY HH:mm')}
              </div>
              <span>{summaryResponse.pickupStation?.location.name}</span>
            </div>
            <div className='text-sm'>
              <div className='font-bold'>Teslim Ediş</div>
              <div>
                {dayjs(carDetail.returnDate).utc().format('DD MMMM YYYY HH:mm')}
              </div>
              <span>{summaryResponse.returnStation?.location.name}</span>
            </div>
          </div>
        </div>
        <div className='text-sm'>
          <div className='flex items-center justify-between rounded-sm bg-blue-50 p-2'>
            <div className='font-semibold'>Kartınızdan Çekilecek Tutar</div>
            <div className='font-bold'>
              {formatCurrency(summaryResponse.totalPrice)}
            </div>
          </div>
          <div className='flex justify-between gap-2 p-2 text-gray-600'>
            <div>Günlük Kiralama Tutarı</div>
            <div className='font-bold'>
              {formatCurrency(responseFirstItem.basePrice.value)}
            </div>
          </div>
          <div className='flex justify-between rounded-sm bg-blue-50 p-2'>
            <div className='font-semibold'>Ofiste Ödenecek Tutar</div>
            <div className='font-bold'>
              {formatCurrency(payAtOfficeTotalPrice)}
            </div>
          </div>
          <div className='mt-1 flex items-center justify-between border-t p-2 pt-3'>
            <div className='text-lg font-semibold'>Toplam Tutar</div>
            <div className='text-xl font-bold'>
              {formatCurrency(
                summaryResponse.totalPrice + payAtOfficeTotalPrice
              )}
            </div>
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { CarReservationSummary }
