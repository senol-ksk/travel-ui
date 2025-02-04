import { Link } from 'next-view-transitions'
import { formatCurrency } from '@/libs/util'
import { Button, Image, Title } from '@mantine/core'
import { TransferVehicle } from '@/app/transfer/types'
import { createSerializer, useQueryStates } from 'nuqs'
import { transferExtraPageParams } from '@/modules/transfer/searchParams.extras'
import { transferSearchParams } from '@/modules/transfer/searchParams.client'

type Props = {
  data: TransferVehicle
  onSelect?: (vehicle: TransferVehicle) => void
}

export const TransferSearchItem: React.FC<Props> = ({
  data,
  onSelect = () => null,
}) => {
  const [searchParams] = useQueryStates(transferSearchParams)

  const extraSearchParams = createSerializer(transferExtraPageParams)
  const extraPageUrl = extraSearchParams('/transfer/extras', {
    searchToken: searchParams.searchToken,
    sessionToken: searchParams.sessionToken,
    productKey: data.productKey,
  })

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
            <Button
              component={Link}
              href={extraPageUrl}
              onClick={() => onSelect(data)}
            >
              Seç
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
