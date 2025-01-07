import { TransferVehicle } from '@/app/transfer/types'
import { formatCurrency } from '@/libs/util'
import { Button, Image, Title } from '@mantine/core'

type Props = {
  data: TransferVehicle
  onSelect?: (vehicle: TransferVehicle) => void
}

export const TransferSearchItem: React.FC<Props> = ({
  data,
  onSelect = () => null,
}) => {
  return (
    <div className='rounded-lg border border-gray-300'>
      <div className='grid grid-cols-12 gap-3 p-3 md:gap-5'>
        <div className='col-span-12 sm:col-span-2'>
          <Image
            alt={data.vehicleTitle}
            src={data.transferInfo.vehiclePhotoUrl}
            radius={'md'}
          />
        </div>
        <div className='col-span-12 sm:col-span-7'>
          <Title order={4}>{data.vehicleTitle}</Title>
        </div>
        <div className='col-span-12 grid content-start gap-2 text-end sm:col-span-3'>
          <div>
            <small>
              {data.transferData.bookDetail.suggestedVehicleCount} Araç fiyat
            </small>
          </div>
          <div className='text-lg font-semibold'>
            {formatCurrency(data.transferData.bookDetail.sortPrice)}
          </div>
          <div>
            <Button type='button' onClick={() => onSelect(data)}>
              Seç
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
