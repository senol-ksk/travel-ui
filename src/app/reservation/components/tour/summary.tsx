import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import {
  ProductPassengerApiResponseModel,
  TourSummaryViewData,
} from '@/types/passengerViewModel'
import { Image, Title, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { MdDescription } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const TourSummary: React.FC<IProps> = ({ data }) => {
  const tourData = data.SummaryViewDataResponser
    .summaryResponse as TourSummaryViewData
  const tourDay = tourData.package.tourTime + 1
  console.log(tourData)
  return (
    <CheckoutCard>
      <div className='hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
        <MdDescription size={22} className='text-blue-800' />
        <div>Seyahat Özeti</div>
      </div>
      <div className='grid gap-3'>
        <div>
          <Image
            src={tourData.package.imageUrl}
            alt={tourData.package.title}
            radius={'md'}
          />
        </div>
        <div className='text-lg font-semibold'>
          {tourData.package.region.title}
        </div>
        <div className='flex gap-3 text-sm'>
          <div className='font-normal'>
            {dayjs(tourData.package.startDate).format('DD MMMM YYYY dddd')}
          </div>
          {'-'}
          <div>
            {' '}
            {tourData.package.tourTime} Gece {tourDay} Gün
          </div>
        </div>
        <div className='my-3 flex justify-center gap-4 border p-3 text-center'>
          <div>
            <div className='text-sm'>Başlangıç Tarihi</div>
            <div className='font-semibold'>
              {dayjs(tourData.package.startDate).format('DD MMMM YYYY')}
            </div>
          </div>
          <div className='border' />
          <div>
            <div className='text-sm'>Bitiş Tarihi</div>
            <div className='font-semibold'>
              {dayjs(tourData.package.endDate).format('DD MMMM YYYY')}
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div>Misafirler</div>
          <div className='font-bold'>
            {' '}
            {tourData.package.passengerPrices.map(
              (passengerPrice, passengerPriceIndex) => {
                const adultCount = passengerPrice.passengers.filter(
                  (item) => item.gender === 0
                )
                const childCount = passengerPrice.passengers.filter(
                  (item) => item.gender !== 0
                )
                return (
                  <div key={passengerPriceIndex}>
                    <div>{adultCount.length} Yetişkin</div>
                    {childCount.length > 0 && (
                      <div>{childCount.length} Çocuk</div>
                    )}
                  </div>
                )
              }
            )}
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div>Otel & Ulaşım Bilgisi</div>
          <Tooltip
            label={
              <div className='grid gap-3'>
                {tourData.detail.flightInformation && (
                  <div
                    className='text-sm'
                    dangerouslySetInnerHTML={{
                      __html: tourData.detail.flightInformation,
                    }}
                  />
                )}
                {tourData.package.hotelInformations[0] && (
                  <div
                    className='text-sm'
                    dangerouslySetInnerHTML={{
                      __html: tourData.package.hotelInformations[0].name,
                    }}
                  />
                )}
              </div>
            }
          >
            <div className='cursor-pointer font-bold text-blue-800'>
              Detaylı Bilgi
            </div>
          </Tooltip>
        </div>
        <div className='flex items-center justify-between gap-2 border-t pt-3 font-semibold'>
          <div className='text-lg'>Toplam Tutar</div>
          <div className='text-xl font-semibold'>
            {formatCurrency(tourData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TourSummary }
