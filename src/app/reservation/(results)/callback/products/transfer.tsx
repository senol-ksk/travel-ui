import { EmailCard } from '@/app/order-components/email-card'
import { TransferSummaryResponse } from '@/app/reservation/types'
import { CheckoutCard } from '@/components/card'
import { Title } from '@mantine/core'
import { Img } from '@react-email/components'
import Image from 'next/image'
import { formatCurrency } from '@/libs/util'

type IProps = {
  data: TransferSummaryResponse
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const {
    selectResponse: { transferVehicle },
  } = data

  return (
    <>
      <CheckoutCard title='Transfer Bilgisi'>
        <div className='grid gap-4 md:grid-cols-6 md:gap-3'>
          <div className='md:col-span-2'>
            <Img
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
            </div>
          </div>
        </div>
      </CheckoutCard>

      {transferVehicle.transferData.bookDetail.extraServices &&
        transferVehicle.transferData.bookDetail.extraServices.length > 0 && (
          <CheckoutCard title='Ekstra Hizmetler' className='mt-3'>
            <div className='space-y-3'>
              {transferVehicle.transferData.bookDetail.extraServices.map(
                (service, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0'
                  >
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>
                        {service.title ||
                          service.description ||
                          'Ekstra Hizmet'}
                      </div>
                      {service.description &&
                        service.description !== service.title && (
                          <div className='mt-1 text-sm text-gray-500'>
                            {service.description}
                          </div>
                        )}
                    </div>
                    <div className='ml-4 text-right'>
                      <div className='text-md font-semibold text-blue-600'>
                        {service.priceWithMarkup.amount === 0
                          ? 'Ücretsiz'
                          : `${service.priceWithMarkup.amount} ${service.priceWithMarkup.transferCurrencyType === 1 ? 'TL' : 'USD'}`}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CheckoutCard>
        )}
    </>
  )
}

export { TransferSummary }
