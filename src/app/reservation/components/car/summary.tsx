import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { CarSummaryResponse } from '../../types'
import { Image, Title } from '@mantine/core'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formatCurrency } from '@/libs/util'

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

  return (
    <div className='grid gap-3'>
      <Title order={5}>
        {carDetail.name} - <small>{carDetail.category}</small>
      </Title>
      <div className='my-2 flex h-[100px] items-center justify-center'>
        <Image src={carDetail.imageUrl} alt={carDetail.name} h='100%' />
      </div>
      <div>
        <div className='font-semibold'>Teslim Alış</div>
        <div>
          {dayjs(carDetail.pickupDate).utc().format('DD MMMM YYYY HH:mm')}
        </div>
      </div>
      <div>
        <div className='font-semibold'>Teslim Ediş</div>
        <div>
          {dayjs(carDetail.returnDate).utc().format('DD MMMM YYYY HH:mm')}
        </div>
      </div>
      <div className='flex gap-2 text-sm text-gray-600'>
        <div className='font-semibold'>Günlük Kiralama Tutarı</div>
        <div>{formatCurrency(responseFirstItem.basePrice.value)}</div>
      </div>
      <div className='rounded-sm bg-blue-50 p-2'>
        <div className='font-semibold'>Kartınızdan Çekilecek Tutar</div>
        <div>{formatCurrency(summaryResponse.totalPrice)}</div>
      </div>

      <div className='rounded-sm bg-red-50 p-2'>
        <div className='font-semibold'>Ofiste Ödenecek Tutar</div>
        <div>{formatCurrency(payAtOfficeTotalPrice)}</div>
      </div>
      <div className='mt-1 flex items-center justify-between border-t pt-3'>
        <div className='font-semibold'>Toplam Tutar</div>
        <div className='text-lg font-semibold'>
          {formatCurrency(summaryResponse.totalPrice + payAtOfficeTotalPrice)}
        </div>
      </div>
    </div>
  )
}

export { CarReservationSummary }
