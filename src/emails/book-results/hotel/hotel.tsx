import {
  HotelSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { Column, Img, Row } from '@react-email/components'

import { hotelDummyOrderResultResponse } from '../_dummy-response/hotel'
import { EmailBody } from '../../_components/body'
import { EmailCard } from '../../_components/email-card'
import dayjs from 'dayjs'
import { formatCurrency } from '@/libs/util'
import { Svg } from '@/emails/_components/svg'
type IProps = {
  data: OperationResultType
}

export default function EmailHotelOrderResult({ data }: IProps) {
  const { roomGroup } = data.product.summaryResponse as HotelSummaryResponse
  const { passenger, hotelCancelWarranty } = data

  return (
    <EmailBody>
      <div
        style={{
          backgroundColor: '#F5FAF6',
          padding: '30px',
          borderRadius: '10px',
        }}
        className='p-xl mb-3 grid text-center font-bold'
      >
        <div>
          <Svg>
            <path
              d='M21.2 33.2L35.3 19.1L32.5 16.3L21.2 27.6L15.5 21.9L12.7 24.7L21.2 33.2ZM24 44C21.2333 44 18.6333 43.475 16.2 42.425C13.7667 41.375 11.65 39.95 9.85 38.15C8.05 36.35 6.625 34.2333 5.575 31.8C4.525 29.3667 4 26.7667 4 24C4 21.2333 4.525 18.6333 5.575 16.2C6.625 13.7667 8.05 11.65 9.85 9.85C11.65 8.05 13.7667 6.625 16.2 5.575C18.6333 4.525 21.2333 4 24 4C26.7667 4 29.3667 4.525 31.8 5.575C34.2333 6.625 36.35 8.05 38.15 9.85C39.95 11.65 41.375 13.7667 42.425 16.2C43.475 18.6333 44 21.2333 44 24C44 26.7667 43.475 29.3667 42.425 31.8C41.375 34.2333 39.95 36.35 38.15 38.15C36.35 39.95 34.2333 41.375 31.8 42.425C29.3667 43.475 26.7667 44 24 44Z'
              fill='#2F9E44'
            />
          </Svg>
        </div>
        Sayın {data.passenger.passengers[0].fullName},
        <br /> İşleminiz başarı ile gerçekleşmiştir. Bir sonraki seyahatinizde
        görüşmek üzere
      </div>
      {hotelCancelWarranty.couponActive && (
        <EmailCard
          title={
            <div className='flex items-center gap-2'>
              <Svg>
                <path
                  d='M8.03876 13.4895H9.96124V8.11793H8.03876V13.4895ZM9 6.45919C9.27976 6.45919 9.51432 6.36459 9.70367 6.17538C9.89288 5.98603 9.98748 5.75148 9.98748 5.47171C9.98748 5.19195 9.89288 4.95739 9.70367 4.76804C9.51432 4.57884 9.27976 4.48423 9 4.48423C8.72024 4.48423 8.48568 4.57884 8.29633 4.76804C8.10712 4.95739 8.01252 5.19195 8.01252 5.47171C8.01252 5.75148 8.10712 5.98603 8.29633 6.17538C8.48568 6.36459 8.72024 6.45919 9 6.45919ZM9 18C7.75172 18 6.58048 17.7639 5.48627 17.2917C4.39191 16.8195 3.44001 16.1787 2.63056 15.3694C1.82126 14.56 1.18051 13.6081 0.708304 12.5137C0.236101 11.4195 0 10.2483 0 9C0 7.75172 0.236101 6.58048 0.708304 5.48627C1.18051 4.39191 1.82126 3.44001 2.63056 2.63056C3.44001 1.82126 4.39191 1.18051 5.48627 0.708304C6.58048 0.236101 7.75172 0 9 0C10.2483 0 11.4195 0.236101 12.5137 0.708304C13.6081 1.18051 14.56 1.82126 15.3694 2.63056C16.1787 3.44001 16.8195 4.39191 17.2917 5.48627C17.7639 6.58048 18 7.75172 18 9C18 10.2483 17.7639 11.4195 17.2917 12.5137C16.8195 13.6081 16.1787 14.56 15.3694 15.3694C14.56 16.1787 13.6081 16.8195 12.5137 17.2917C11.4195 17.7639 10.2483 18 9 18ZM9 15.9933C10.9558 15.9933 12.6104 15.3167 13.9636 13.9636C15.3167 12.6104 15.9933 10.9558 15.9933 9C15.9933 7.04415 15.3167 5.38961 13.9636 4.03636C12.6104 2.68326 10.9558 2.00671 9 2.00671C7.04415 2.00671 5.38961 2.68326 4.03636 4.03636C2.68326 5.38961 2.00671 7.04415 2.00671 9C2.00671 10.9558 2.68326 12.6104 4.03636 13.9636C5.38961 15.3167 7.04415 15.9933 9 15.9933Z'
                  fill='#E03131'
                />
              </Svg>

              <div style={{ color: '#E03131' }} className='text-md'>
                %25&#39;ini Şimdi, %75&#39;ini Tatilden Önce Öde Kampanya
                Bilgilendirme
              </div>
            </div>
          }
        >
          <div>
            Rezervasyonunuzun %25’i olan 12.500 TL ve güvence bedeli paketi olan
            175.00 TL tahsil edilmiştir. Kalan 32.500,00 TL ilk tutarı, otele
            giriş gününüze 4 kalaya (11 Haziran 2025) kadar, rezervasyonlarım
            sayfanıza girerek tamamlayabilirsiniz. Kampanya veya fiyat
            değişikliği olamsı halinde kalan tutar sabit kalacak ve
            değişmeyecektir. Kalan tutarı taksitli ödemek isterseniz, ödeme
            yaptığınız günkü “Parafflytravel.com” taksitli ödeme koşulları” baz
            alınacaktır.{' '}
          </div>
        </EmailCard>
      )}
      <EmailCard title='Otel Bilgisi'>
        <Row>
          <Column width='330'>
            <Img
              width='310'
              src={roomGroup.hotel.images.at(0)?.original}
              alt={roomGroup.hotel.name}
              style={{ borderRadius: '10px' }}
            />
          </Column>

          <Column valign='top'>
            <strong>{roomGroup.hotel.name}</strong>
            <div>{roomGroup.hotel.address}</div>

            <table className='mt-2' cellPadding={6}>
              <tbody>
                <tr>
                  <td>
                    <div>Giriş Tarihi</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkInDate).format('DD MMMM YYYY dddd')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Çıkış Tarihi</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkOutDate).format('DD MMMM YYYY dddd')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Konaklama</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkOutDate).diff(
                      roomGroup.checkInDate,
                      'day'
                    )}{' '}
                    Gece /{' '}
                    {dayjs(roomGroup.checkOutDate).diff(
                      roomGroup.checkInDate,
                      'day'
                    ) + 1}{' '}
                    Gün
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Misafirler</div>
                  </td>
                  <td>:</td>
                  <td>{data.passenger.passengers.length} Kişi</td>
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </EmailCard>
      <EmailCard title='Oda Bilgisi'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='font-bold'>
              <Column>Ünvan</Column>
              <Column>Adı Soyadı</Column>
              <Column>Doğum Tarihi</Column>
              <Column>TC. No</Column>
            </tr>
          </thead>
          <tbody>
            {data.passenger.passengers.map(
              ({ fullName, gender, identityNumber, birthday }) => {
                return (
                  <tr key={identityNumber}>
                    <Column>{gender == 0 ? 'Bay' : 'Bayan'}</Column>
                    <Column>{fullName}</Column>
                    <Column>{dayjs(birthday).format('DD.MM.YYYY')}</Column>
                    <Column>{identityNumber}</Column>
                  </tr>
                )
              }
            )}
          </tbody>
        </Row>
        <div className='mt-5 text-sm'>
          <span className='font-bold' style={{ display: 'flex', gap: '5px' }}>
            İptal Koşulları :{''}{' '}
            <div style={roomGroup.nonRefundable ? {} : { color: '#2F9E44' }}>
              {roomGroup.nonRefundable ? ' İptal Edilemez' : 'Ücretsiz İptal'}
            </div>
          </span>

          {roomGroup.cancellationPolicies.map((cancelWarranty, index) => {
            return (
              <div className='text-green' key={index}>
                {cancelWarranty.description}
              </div>
            )
          })}
        </div>
      </EmailCard>
      <EmailCard title='Fatura Bilgileri'>
        <table cellPadding={2}>
          <thead>
            <tr>
              <td>İsim Soyisim</td>
              <td>:</td>
              <td>{data.passenger.passengers.at(0)?.fullName}</td>
            </tr>
            <tr>
              <td>TC. Kimlik No</td>
              <td>:</td>
              <td>{data.passenger.passengers.at(0)?.identityNumber}</td>
            </tr>
            <tr>
              <td>GSM</td>
              <td>:</td>
              <td>{data.passenger.passengers.at(0)?.mobilePhoneNumber}</td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td>{data.passenger.billingInformation.at(0)?.address}</td>
            </tr>
          </thead>
        </table>
        <div
          className='my-2 flex items-center gap-2 font-bold text-white'
          style={{
            padding: '10px;',
            backgroundColor: '#1F6CE0',
            borderRadius: '10px',
          }}
        >
          <Svg>
            <path
              d='M2.9 3C4.9 1 7.2 0 10 0C12.7 0 15.1 1 17.1 2.9C19.1 4.9 20 7.2 20 10C20 12.8 19 15.1 17.1 17.1C15.1 19.1 12.8 20 10 20C7.2 20 4.9 19 2.9 17.1C1 15.1 0 12.8 0 10C0 7.3 1 4.9 2.9 3ZM10 11C10.5523 11 11 10.5523 11 10V6C11 5.44771 10.5523 5 10 5C9.44771 5 9 5.44771 9 6V10C9 10.5523 9.44771 11 10 11ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44771 13 9 13.4477 9 14C9 14.5523 9.44771 15 10 15Z'
              fill='white'
            />
          </Svg>
          E-faturanız mail adresinize ayrıca gönderilecektir.
        </div>
      </EmailCard>
      <EmailCard title='Ödeme Bilgileri'>
        <table cellPadding={2}>
          <tr>
            <td width={200}>Toplam Fiyat</td>
            <td>:</td>
            <td className='font-bold'>
              {formatCurrency(passenger.paymentInformation.basketTotal)}
            </td>
          </tr>
          {hotelCancelWarranty.couponActive && (
            <>
              <tr>
                <td>Ön Ödeme Tutarı</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(passenger.paymentInformation.collectingTotal)}
                </td>
              </tr>
              <tr>
                <td>Son Ödeme Tarihi</td>
                <td>:</td>
                <td className='font-bold'>20-07-2001</td>
              </tr>
              <tr>
                <td>Kalan Ödeme Tutarı</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(
                    passenger.paymentInformation.basketDiscountTotal
                  )}
                </td>
              </tr>
            </>
          )}
          <tr>
            <td>Kart Numarası</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.encryptedCardNumber}
            </td>
          </tr>
          <tr>
            <td>Kart Sahibi</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.encryptedCardHolder}
            </td>
          </tr>
          <tr>
            <td>Tahsil Edilen Tutar</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.installmentCount > 1 && (
                <>{passenger.paymentInformation.installmentCount} Taksit =</>
              )}
              {formatCurrency(passenger.paymentInformation.collectingTotal)}
            </td>
          </tr>
        </table>
      </EmailCard>
      <div
        className='rounded-md border bg-blue-100'
        style={{
          borderColor: '#ECF4FD',
          backgroundColor: '#ECF4FD',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        <div className='text-sm font-bold'>Bilgilendirme</div>
        <ul>
          <li>
            Satın almış olduğunuz seyahatinizi iptal etmeniz durumunda, Acente
            tarafından alınan hizmet bedeli iade edilmemektedir.
          </li>
          <li>
            Detaylı bilgi için haftanın her günü 09:00-18:00 saatleri arasında
            0850 878 0 400 nolu telefondan Müşteri Hizmetlerimize
            ulaşabilirsiniz.
          </li>
          <li>
            Muhasebe işlemleri için{' '}
            <a href='mailto:muhasebe@ykmturizm.com.tr'>
              muhasebe@ykmturizm.com.tr
            </a>{' '}
            mail adresinden detaylı bilgi alabilirsiniz.
          </li>
        </ul>
      </div>
    </EmailBody>
  )
}

EmailHotelOrderResult.PreviewProps = {
  data: hotelDummyOrderResultResponse,
}
