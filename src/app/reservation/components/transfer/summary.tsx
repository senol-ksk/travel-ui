import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { TransferSummaryResponseViewDataResponser } from '../../types'
import { Image, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import { MdDescription } from 'react-icons/md'

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
        <div className='hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
          <MdDescription size={22} className='text-blue-800' />
          <div>Seyahat Özeti</div>
        </div>

        <div className='grid items-center justify-center'>
          <div className='w-[250px]'>
            <Image
              src={transferVehicle.transferInfo.vehiclePhotoUrl}
              alt={transferVehicle.vehicleName}
              className='h-auto w-full rounded-md object-contain'
            />
          </div>
        </div>
        <Title order={3}>{transferVehicle.vehicleName}</Title>
        <div>
          Maks. {transferVehicle.transferInfo.transferMax.pax}, Maks.{' '}
          {transferVehicle.transferInfo.transferMax.suitcase}
        </div>
        <div className='grid grid-cols-2 items-baseline rounded-md border p-2 py-4 text-sm text-gray-700'>
          <div className='flex flex-col items-center text-center'>
            <div className='font-bold'>Alış Bilgileri</div>
            <div className='grid text-sm'>
              <div className='font-medium'>
                {dayjs(selectResponse.pickupDate).format('DD MMMM YYYY HH:mm')}
              </div>
              <div> {selectResponse.pickupPointName}</div>
            </div>
          </div>

          <div className='relative flex flex-col items-center text-center'>
            <div className='absolute top-1/2 left-0 h-16 -translate-y-1/2 border-l border-gray-300'></div>

            <div className='font-bold'>Bırakış Bilgileri</div>
            <div className='grid text-sm'>
              <div>{selectResponse.dropPointName}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-3 border-t pt-3'>
          <div className='text-lg font-bold'>Toplam Tutar</div>
          <div className='text-xl font-bold'>
            {formatCurrency(transferData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TransferSummary }
