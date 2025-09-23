import { EmailCard } from '@/app/order-components/email-card'
import { TransferSummaryResponse } from '@/app/reservation/types'
import { CheckoutCard } from '@/components/card'
import { Title } from '@mantine/core'
import { Img, Link } from '@react-email/components'
import Image from 'next/image'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'

type IProps = {
  data: TransferSummaryResponse
}

const TransferSummary: React.FC<IProps> = ({ data }) => {
  const {
    selectResponse: { transferVehicle },
    selectResponse,
  } = data

  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          height={200}
          className='mb-3 w-auto'
          src='https://ykmturizm.mncdn.com/11/Files/638932871618301570.png'
        />
      </Link>
      <CheckoutCard title='Transfer Bilgisi'>
        <div className='grid gap-4 md:grid-cols-8 md:gap-3'>
          <div className='md:col-span-3'>
            <Img
              height={200}
              className='w-full rounded-lg'
              src={transferVehicle.transferInfo.vehiclePhotoUrl}
              alt={transferVehicle.vehicleName}
            />
          </div>
          <div className='md:col-span-5'>
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

      <CheckoutCard title='Alış Yeri ve Tarihi' className='mt-3'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Tarih</div>
            <div>:</div>
            <div>{dayjs(selectResponse.pickupDate).format('DD MMM YYYY')}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Saat</div>
            <div>:</div>
            <div>{dayjs(selectResponse.pickupDate).format('HH:mm')}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Konum</div>
            <div>:</div>
            <div>{selectResponse.pickupPointName}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Adres</div>
            <div>:</div>
            <div>{selectResponse.pickupInfo}</div>
          </div>
        </div>
      </CheckoutCard>

      <CheckoutCard title='Varış Yeri ve Tarihi' className='mt-3'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Tarih</div>
            <div>:</div>
            <div>{dayjs(selectResponse.pickupDate).format('DD MMM YYYY')}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Konum</div>
            <div>:</div>
            <div>{selectResponse.dropPointName}</div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-24 font-medium'>Adres</div>
            <div>:</div>
            <div>{selectResponse.dropInfo}</div>
          </div>
        </div>
      </CheckoutCard>

      <CheckoutCard title='Açıklama ve Notlar' className='mt-3'>
        <div className='space-y-3'>
          <div>
            <div className='mb-2 font-bold'>Alış Yeri Adres Bilgisi</div>
            <div className='text-sm text-gray-700'>
              {selectResponse.pickupDescription}
            </div>
          </div>
          <div>
            <div className='mb-2 font-bold'>Varış Yeri Adres Bilgisi</div>
            <div className='text-sm text-gray-700'>
              {selectResponse.dropDescription}
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
