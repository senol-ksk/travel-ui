import {
  HotelSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { Column, Img, Row } from '@react-email/components'

import { hotelDummyOrderResultResponse } from '../_dummy-response/hotel'
import { EmailBody } from '../../_components/body'
import { EmailCard } from '../../../app/order-components/email-card'
import dayjs from 'dayjs'
import { formatCurrency } from '@/libs/util'
import { SuccessCard } from '@/app/order-components/success-card'
import { BillingCard } from '@/app/order-components/billing-card'

type IProps = {
  data: OperationResultType
}

export default function EmailHotelOrderResult({ data }: IProps) {
  const { roomGroup } = data.product.summaryResponse as HotelSummaryResponse
  const { passenger, hotelCancelWarranty } = data
  const passengerInfo = data.passenger.passengers[0]
  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />

      {hotelCancelWarranty.couponActive && (
        <EmailCard
          title={
            <div className='text-md flex items-center text-red-800'>
              <Img
                className='mr-3'
                src='https://ykmturizm.mncdn.com/11/Files/email/img/red-info.png'
              />
              %25&#39;ini Şimdi, %75&#39;ini Tatilden Önce Öde Kampanya
              Bilgilendirme
            </div>
          }
        >
          <div>
            {hotelCancelWarranty.couponActive && (
              <div>
                Rezervasyonunuzun %25 olan:{' '}
                <strong>
                  {formatCurrency(
                    passenger.paymentInformation.basketTotal -
                      passenger.paymentInformation.basketDiscountTotal
                  )}
                </strong>{' '}
                ve güvence paketi tahsil edilmiştir. Kalan{' '}
                <strong>
                  {formatCurrency(
                    passenger.paymentInformation.basketDiscountTotal
                  )}
                </strong>{' '}
                lik tutarı, otele giriş gününüze 4 gün kalaya (
                {dayjs(roomGroup.checkInDate)
                  .subtract(4, 'days')
                  .format('DD MMMM YYYY')}
                ) kadar, rezervasyonlarım sayfasına giderek tamamlayabilirsiniz.
                Kampanya veya fiyat değişikliği olması halinde kalan tutar sabit
                kalacak ve değişmeyecektir. Kalan tutarı taksitli ödemek
                isterseniz, ödeme yaptığınız günkü taksitli ödeme koşulları baz
                alınacaktır.
              </div>
            )}
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
            İptal Koşulları :{' '}
            <div>
              {roomGroup.nonRefundable ? ' İptal Edilemez' : 'Ücretsiz İptal'}
            </div>
          </span>

          {roomGroup.cancellationPolicies.map((cancelWarranty, index) => (
            <div className='pt-3' key={index}>
              {cancelWarranty.description}
            </div>
          ))}
        </div>
      </EmailCard>
      <EmailCard title='Fatura Bilgileri'>
        <BillingCard
          data={{
            fullName: passengerInfo.fullName,
            idNumber: passengerInfo.identityNumber,
            gsm: passengerInfo.mobilePhoneNumber,
            address: data.passenger.billingInformation.at(0)?.address,
          }}
        />
      </EmailCard>
      <EmailCard title='Ödeme Bilgileri'>
        <table cellPadding={2}>
          <tr>
            <td width={150}>Toplam Fiyat</td>
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
                <td className='font-bold'>
                  {dayjs(roomGroup.checkInDate)
                    .subtract(4, 'days')
                    .format('DD MMMM YYYY')}
                </td>
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
