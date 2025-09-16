import { CheckIcon, Title, Alert } from '@mantine/core'
import { CgDanger } from 'react-icons/cg'
import dayjs from 'dayjs'

import { HotelSummaryResponse } from '@/app/reservation/types'
import { EmailCard } from '@/app/order-components/email-card'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import { SummaryPassengerData } from '@/app/account/reservations/types'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: HotelSummaryResponse
  passengerCount?: number
  passengerData?: SummaryPassengerData
}

const HotelSummary: React.FC<IProps> = ({
  data,
  passengerCount,
  passengerData,
}) => {
  const { roomGroup } = data

  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          height={200}
          className='mb-3 w-auto'
          src='https://ykmturizm.mncdn.com/11/Files/638932871618301570.png'
        />
      </Link>
      <CheckoutCard title='Otel Bilgisi'>
        <div className='grid gap-3 md:grid-cols-8 md:gap-5'>
          <div className='md:col-span-4'>
            <Img
              width={310}
              height={600}
              src={roomGroup.hotel.images.at(0)?.original || ''}
              alt={roomGroup.hotel.name}
              className='w-full rounded-lg'
            />
          </div>
          <div className='md:col-span-4'>
            <strong className='text-lg'>{roomGroup.hotel.name}</strong>
            <div className='mt-1 text-gray-600'>{roomGroup.hotel.address}</div>

            <div className='mt-2 space-y-1'>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Giriş Tarihi</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(roomGroup.checkInDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Çıkış Tarihi</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(roomGroup.checkOutDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Konaklama</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(roomGroup.checkOutDate).diff(
                    roomGroup.checkInDate,
                    'day'
                  )}{' '}
                  Gece
                </div>
              </div>
              {passengerCount && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Misafirler</div>
                  <div>:</div>
                  <div className='text-sm'>{passengerCount} Kişi</div>
                </div>
              )}
              {roomGroup.earlyBooking && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Rezervasyon</div>
                  <div>:</div>
                  <div className='text-sm font-medium text-green-600'>
                    <CheckIcon size={16} className='mr-1 inline' />
                    Erken Rezervasyon
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CheckoutCard>
      <div className='my-3'>
        {roomGroup.earlyBooking && (
          <CheckoutCard title='Ön Ödeme Bilgilendirmesi'>
            <Alert
              icon={<CgDanger size={20} />}
              color='red'
              variant='light'
              className='mb-4'
            >
              <div className='space-y-2 text-sm'>
                <p>
                  Rezervasyonunuzun <strong>%25</strong>&apos;i olan{' '}
                  <strong>
                    {formatCurrency(
                      passengerData?.paymentInformation?.collectingTotal || 0
                    )}
                  </strong>{' '}
                  ve güvence paketi ücreti tahsil edilmiştir. Kalan{' '}
                  <strong>
                    {formatCurrency(
                      passengerData?.paymentInformation?.basketDiscountTotal ||
                        0
                    )}
                  </strong>{' '}
                  tutarını <strong>rezervasyonlarım</strong> sayfasından, otel
                  giriş tarihinden <strong>4 gün öncesine kadar</strong>{' '}
                  tamamlayabilirsiniz.
                  <strong>
                    {dayjs(roomGroup.checkInDate)
                      .subtract(4, 'days')
                      .format('DD MMMM YYYY')}
                  </strong>{' '}
                  tarihine kadar ödeme yapabilirsiniz.
                </p>
                <p>
                  Kalan tutar sabit kalacak olup, kampanya veya fiyat
                  değişikliklerinde değişmeyecektir.
                </p>
                <p>
                  Kalan tutarı taksitli ödemek isterseniz, ödeme günündeki
                  taksit ödeme koşulları uygulanacaktır.
                </p>
              </div>
            </Alert>
          </CheckoutCard>
        )}
      </div>
      <CheckoutCard title='İptal Politikası'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <div className='text-sm font-bold'>İptal Koşulları:</div>
            <div className='text-sm'>
              {roomGroup.nonRefundable ? (
                <span className='font-medium text-red-600'>
                  İptal/İade Edilemez
                </span>
              ) : (
                <span className='font-medium text-green-600'>
                  Ücretsiz İptal
                </span>
              )}
            </div>
          </div>
          {roomGroup.cancellationPolicies &&
            roomGroup.cancellationPolicies.length > 0 && (
              <div className='space-y-2'>
                {roomGroup.cancellationPolicies.map((cancelPolicy, index) => (
                  <div key={index} className='pt-2 text-sm text-gray-700'>
                    {cancelPolicy.description}
                  </div>
                ))}
              </div>
            )}
        </div>
      </CheckoutCard>
    </>
  )
}

export { HotelSummary }
