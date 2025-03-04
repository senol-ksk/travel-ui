import { Link } from 'next-view-transitions'
import { Button, Image, rem, Title } from '@mantine/core'
import { createSerializer } from 'nuqs'
import { BsCheck2Circle } from 'react-icons/bs'

import { formatCurrency } from '@/libs/util'
import { TransferVehicle } from '@/app/transfer/types'
import { transferExtraPageParams } from '@/modules/transfer/searchParams.extras'
import { useTransferSearchResults } from './useSearchResults'
import { GoPerson } from 'react-icons/go'
import { PiSuitcaseRolling } from 'react-icons/pi'

type Props = {
  data: TransferVehicle
  onSelect?: (vehicle: TransferVehicle) => void
}

export const TransferSearchItem: React.FC<Props> = ({
  data,
  onSelect = () => null,
}) => {
  const { searchToken, sessionToken } = useTransferSearchResults()

  const extraSearchParams = createSerializer(transferExtraPageParams)
  const extraPageUrl = extraSearchParams('/transfer/extras', {
    searchToken,
    sessionToken,
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
          <Title order={4} pb={rem(18)}>
            {data.vehicleTitle}
          </Title>
          <div className='flex gap-3'>
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <div>
                <GoPerson size={18} />
              </div>
              <div>Maks. {data.transferInfo.transferMax.pax} Yolcu</div>
            </div>
            <div className='flex items-center gap-1 text-sm text-gray-700'>
              <div>
                <PiSuitcaseRolling size={18} />
              </div>
              <div>Maks. {data.transferInfo.transferMax.suitcase}</div>
            </div>
          </div>
          <div className='flex items-center gap-1 pt-2 text-sm text-green-700'>
            <div>
              <BsCheck2Circle size={18} />
            </div>
            <div>
              Son {data.transferInfo.transferHour.freeChange} saate kadar
              değişiklik
            </div>
          </div>
        </div>
        <div className='col-span-12 grid content-start gap-2 text-end sm:col-span-3'>
          <div>
            <small>
              {data.transferData.bookDetail.suggestedVehicleCount} Araç fiyatı
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
