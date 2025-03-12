import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import {
  ProductPassengerApiResponseModel,
  TourSummaryViewData,
} from '@/types/passengerViewModel'
import { Image, Title } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const TourSummary: React.FC<IProps> = ({ data }) => {
  const tourData = data.SummaryViewDataResponser
    .summaryResponse as TourSummaryViewData

  return (
    <CheckoutCard>
      <div className='grid gap-3'>
        <Title order={5}>{tourData.package.title}</Title>
        <div>
          <Image
            src={tourData.package.imageUrl}
            alt={tourData.package.title}
            radius={'md'}
          />
        </div>

        <div className='flex gap-3 text-sm'>
          <span>{tourData.package.description}</span>
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
          {'-'}
          <div>{tourData.package.tourTime} Gece</div>
        </div>
        <div className='flex justify-center gap-4 border p-2 text-center'>
          <div>
            <div className='font-semibold'>Başlangıç Tarihi</div>
            <div>
              {dayjs(tourData.package.startDate).format('DD MMMM YYYY')}
            </div>
          </div>
          <div className='border' />
          <div>
            <div className='font-semibold'>Bitiş Tarihi</div>
            <div>{dayjs(tourData.package.endDate).format('DD MMMM YYYY')}</div>
          </div>
        </div>

        <div className='flex justify-between gap-2 border-t pt-3'>
          <div>Toplam Tutar</div>
          <div className='text-lg font-semibold'>
            {formatCurrency(tourData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TourSummary }
