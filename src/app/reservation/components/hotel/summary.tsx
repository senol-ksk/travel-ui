import {
  HotelSummaryResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { Alert, Image, Skeleton, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const HotelSummarySection: React.FC<IProps> = ({ data }) => {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const summaryResponse = data.SummaryViewDataResponser
    .summaryResponse as HotelSummaryResponse

  const roomGroup = summaryResponse.roomGroup
  const hotel = roomGroup.hotel
  const checkInDate = dayjs(roomGroup.checkInDate)
  const checkOutDate = dayjs(roomGroup.checkOutDate)
  const nightStay = checkOutDate.diff(checkInDate, 'd')

  return (
    <div className='grid gap-3'>
      <div className='relative h-[200px]'>
        <Skeleton
          pos={'absolute'}
          top={0}
          bottom={0}
          width={'100%'}
          visible={isImageLoading}
        />
        <Image
          src={hotel.images.at(0)?.original}
          alt={hotel.name}
          h={'100%'}
          radius={'md'}
          onLoad={() => {
            setIsImageLoading(false)
          }}
        />
      </div>
      <div>
        <Title order={3} fz='h4'>
          {hotel.name}
        </Title>
        <address className='text-sm text-gray-600 not-italic'>
          {hotel.address}
        </address>
      </div>

      <div className='text-sm text-gray-600'>
        <div className='flex gap-2'>
          <div className='font-semibold'>Giriş Tarihi:</div>
          <div>{dayjs(roomGroup.checkInDate).format('DD.MM.YYYY')}</div>
        </div>
        <div className='flex gap-2'>
          <div className='font-semibold'>Çıkış Tarihi:</div>
          <div>{dayjs(roomGroup.checkOutDate).format('DD.MM.YYYY')}</div>
        </div>
        <div className='pt-2'>{nightStay} Gece</div>
      </div>
      <div className='text-sm'>
        {roomGroup.rooms.map((room) => {
          const roomDetail = roomGroup.roomDetails[room.key]

          return (
            <div key={room.key}>
              <strong>{roomDetail.quantity} Oda:</strong>{' '}
              {roomDetail.pensionType}
            </div>
          )
        })}
      </div>
      {!data.HotelCancelWarrantyPriceStatusModel.hasHotelWarranty && (
        <div>
          {roomGroup.nonRefundable ? (
            <div className='text-red-500'>Bu oda iptal edilemez.</div>
          ) : (
            <div className='text-green-500'>Ücretsiz iptal </div>
          )}
        </div>
      )}
      {roomGroup.cancellationPolicies &&
        roomGroup.cancellationPolicies.length > 0 &&
        roomGroup.cancellationPolicies.map(
          (cancelPolicy, cancelPolicyIndex) => (
            <Alert color='yellow' key={cancelPolicyIndex} className='text-sm'>
              {cancelPolicy.description}
            </Alert>
          )
        )}
    </div>
  )
}

export { HotelSummarySection }
