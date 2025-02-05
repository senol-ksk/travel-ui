import { TransferSummaryResponse } from '@/app/reservation/types'
import { Image, Title } from '@mantine/core'

type IProps = {
  data: TransferSummaryResponse
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const {
    selectResponse: { transferVehicle },
  } = data

  return (
    <div>
      <Title fz={'h4'}>
        {transferVehicle.vehicleName}
        <small className='block text-sm font-semibold text-gray-500'>
          {transferVehicle.vehicleTitle}
        </small>
      </Title>
      <div className='py-3'>
        <Image
          mah={200}
          fit='contain'
          src={transferVehicle.transferInfo.vehiclePhotoUrl}
          alt={transferVehicle.vehicleTitle}
        />
      </div>
    </div>
  )
}

export { TransferSummary }
