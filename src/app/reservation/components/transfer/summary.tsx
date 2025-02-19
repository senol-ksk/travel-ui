import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { TransferSummaryResponseViewDataResponser } from '../../types'
import { Image, Title } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const transferData = data.SummaryViewDataResponser
    .summaryResponse as TransferSummaryResponseViewDataResponser

  const selectResponse = transferData.selectResponse
  const transferVehicle = selectResponse.transferVehicle

  return (
    <div>
      <Title order={5}>{transferVehicle.vehicleName}</Title>
      <Image
        src={transferVehicle.transferInfo.vehiclePhotoUrl}
        alt={transferVehicle.vehicleName}
      />
      <div>
        <div className='font-semibold'>Alış bilgileri</div>
        <div>
          {selectResponse.pickupPointName}, {selectResponse.pickupLocationName}
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
    </div>
  )
}

export { TransferSummary }
