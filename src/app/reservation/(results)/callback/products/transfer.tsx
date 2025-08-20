import { EmailCard } from '@/app/order-components/email-card'
import { TransferSummaryResponse } from '@/app/reservation/types'
import { CheckoutCard } from '@/components/card'
import { Title } from '@mantine/core'
import Image from 'next/image'

type IProps = {
  data: TransferSummaryResponse
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const {
    selectResponse: { transferVehicle },
  } = data

  return (
    <CheckoutCard title='Transfer Bilgisi'>
      <div className='grid gap-4 md:grid-cols-6 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            width={310}
            height={200}
            className='w-full rounded-lg'
            src={transferVehicle.transferInfo.vehiclePhotoUrl}
            alt={transferVehicle.vehicleName}
          />
        </div>
        <div className='md:col-span-4'>
          <div>
            <strong className='text-lg'>{transferVehicle.vehicleName}</strong>
          </div>
          <div className='mt-1 text-sm text-gray-600'>
            Maks. {transferVehicle.transferInfo.transferMax.pax} Yolcu, Maks.{' '}
            {transferVehicle.transferInfo.transferMax.suitcase} Bavul
          </div>
          <div className='mt-3 space-y-2'>
            <div className='text-sm text-gray-700'>
              Son {transferVehicle.transferInfo.transferHour.freeCancel} saate
              kadar iptal ve değişiklik
            </div>
            {transferVehicle.extraServices &&
              transferVehicle.extraServices.length > 0 &&
              transferVehicle.extraServices.map(
                (service: { name?: string; description?: string }, index) => (
                  <div key={index} className='text-sm text-gray-700'>
                    {service.name || service.description || 'Ekstra Hizmet'}
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TransferSummary }
