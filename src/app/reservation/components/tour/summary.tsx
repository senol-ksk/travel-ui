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
    <div>
      <Title order={5}>{tourData.package.title}</Title>
      <div className='py-5'>
        <Image
          src={tourData.package.imageUrl}
          alt={tourData.package.title}
          radius={'md'}
        />
      </div>
      <div className='text-sm leading-none text-gray-600'>
        {tourData.package.description}
      </div>
      <div className='my-4 flex justify-center gap-4 border p-2 text-center'>
        <div>
          <div className='font-semibold'>Başlangıç Tarihi</div>
          <div>{dayjs(tourData.package.startDate).format('DD MMMM YYYY')}</div>
        </div>
        <div className='border' />
        <div>
          <div className='font-semibold'>Bitiş Tarihi</div>
          <div>{dayjs(tourData.package.endDate).format('DD MMMM YYYY')}</div>
        </div>
      </div>
      <div>
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
                {childCount.length > 0 && <div>{childCount.length} Çocuk</div>}
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}

export { TourSummary }
