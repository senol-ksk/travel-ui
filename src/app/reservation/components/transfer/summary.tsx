import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { TransferSummaryResponseViewDataResponser } from '../../types'
import { Image, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const transferData = data.SummaryViewDataResponser
    .summaryResponse as TransferSummaryResponseViewDataResponser

  const selectResponse = transferData.selectResponse
  const transferVehicle = selectResponse.transferVehicle

  return (
    <CheckoutCard>
      <div className='grid gap-3'>
        <Title order={5}>{transferVehicle.vehicleName}</Title>
        <div className='p-2'>
          <Image
            src={transferVehicle.transferInfo.vehiclePhotoUrl}
            alt={transferVehicle.vehicleName}
          />
        </div>
        <div>
          <div className='font-semibold'>Alış bilgileri</div>
          <div>
            {selectResponse.pickupPointName},{' '}
            {selectResponse.pickupLocationName}
          </div>
          <div>
            {dayjs(selectResponse.pickupDate).format('DD MMMM YYYY HH:mm')}
          </div>
        </div>
        <div className='pt-3'>
          <div className='font-semibold'>Bırakış bilgileri</div>
          <div>
            {selectResponse.dropPointName}, {selectResponse.dropLocationName}
          </div>
        </div>
        <div className='flex justify-between gap-3 border-t pt-3'>
          <div>Toplam Tutar</div>
          <div className='text-lg font-semibold'>
            {formatCurrency(transferData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TransferSummary }
