import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, rem, Title } from '@mantine/core'
import { createSerializer } from 'nuqs'
import { BsCheck2Circle } from 'react-icons/bs'

import { formatCurrency } from '@/libs/util'
import { TransferVehicle } from '@/app/transfer/types'
import { transferExtraPageParams } from '@/modules/transfer/searchParams.extras'
import { useTransferSearchResults } from './useSearchResults'
import { GoPerson } from 'react-icons/go'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { MdOutlineChevronRight } from 'react-icons/md'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { Route } from 'next'

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
  }) as Route

  return (
    <div className='relative rounded-lg border shadow'>
      <div className='start-0-0 absolute top-1/2 mt-5 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-gray-400 md:mt-0' />
      <div className='grid gap-3 md:grid-cols-12 md:gap-5'>
        <div className='col-span-12 content-center px-4 md:col-span-3 md:py-3'>
          <Box
            mx='auto'
            w={{
              base: 200,
              md: 'auto',
            }}
          >
            <Image
              alt={data.vehicleTitle}
              src={data.transferInfo.vehiclePhotoUrl}
              radius={'md'}
              h='100%'
            />
          </Box>
        </div>
        <div className='col-span-12 content-center px-5 md:col-span-6 md:py-5'>
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
          <div className='flex items-center gap-1 pt-2 text-sm text-green-800'>
            <div>
              <IoIosCheckmarkCircle size={18} />
            </div>
            <div>
              Son {data.transferInfo.transferHour.freeChange} saate kadar
              değişiklik
            </div>
          </div>
        </div>
        <div className='col-span-12 flex content-start items-center justify-between gap-2 border-t p-5 text-end leading-none md:col-span-3 md:grid md:content-center md:justify-center md:border-t-0 md:border-l md:p-0'>
          <div className='grid items-center justify-center'>
            <div className='text-start text-sm'>
              {data.transferData.bookDetail.suggestedVehicleCount} Araç fiyatı
            </div>
            <div className='text-2xl font-semibold'>
              {formatCurrency(data.transferData.bookDetail.sortPrice)}
            </div>
          </div>
          <div className='md:w-32'>
            <Button
              fullWidth
              radius={'md'}
              component={Link}
              href={extraPageUrl}
              onClick={() => onSelect(data)}
              rightSection={<MdOutlineChevronRight />}
            >
              Seç
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
