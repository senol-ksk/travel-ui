import { Column, Heading, Img, Row } from '@react-email/components'
import { OperationResultType } from '@/app/reservation/types'
import { EmailBody } from '../../_components/body'
import { EmailCard } from '../../_components/email-card'
import { SuccessCard } from '@/emails/_components/success-card'
import { formatCurrency } from '@/libs/util'
import { __dummy__TourDummyResponsePaymentSummaryResponse } from '../_dummy-response/tour'
import dayjs from 'dayjs'
import { TourSummaryViewData } from '@/types/passengerViewModel'
import { Spoiler } from '@mantine/core'
import Link from 'next/link'

type IProps = {
  data: OperationResultType
}

export default function EmailTourOrderResult({ data }: IProps) {
  const { passenger, product } = data
  const tour = (product.summaryResponse as TourSummaryViewData).package
  const billing = passenger.billingInformation[0]
  const payment = passenger.paymentInformation
  const firstPassenger = passenger.passengers[0]
  console.log(tour)
  return (
    <EmailBody>
      <SuccessCard name={firstPassenger.fullName} />
      <EmailCard title='Tur Bilgisi'>
        <table cellPadding={4}>
          <span className='text-lg font-bold'>{tour.title}</span>
          <tbody>
            <tr>
              <td width={150}>Giriş Tarihi</td>
              <td>:</td>
              <td>{dayjs(tour.startDate).format('DD MMMM YYYY dddd')}</td>
            </tr>
            <tr>
              <td>Çıkış Tarihi</td>
              <td>:</td>
              <td>{dayjs(tour.endDate).format('DD MMMM YYYY dddd')}</td>
            </tr>
            {tour.hotelInformations?.[0]?.name &&
              tour.hotelInformations[0].name.trim() !== '' && (
                <tr>
                  <td>Konaklama</td>
                  <td>:</td>
                  <td>{tour.hotelInformations[0].name}</td>
                </tr>
              )}
            {tour.detail.flightInformation &&
              tour.detail.flightInformation.length > 0 && (
                <tr>
                  <td>Ulaşım</td>
                  <td>:</td>
                  <td>{tour.detail.flightInformation}</td>
                </tr>
              )}
          </tbody>
        </table>
      </EmailCard>

      <EmailCard title='Yolcu Bilgileri'>
        <Row cellPadding={6}>
          <thead>
            <tr className='font-bold'>
              <Column>ÜNVAN</Column>
              <Column>ADI SOYADI</Column>
              <Column>DOĞUM TARİHİ</Column>
              <Column>TC. NO</Column>
              <Column>REZERVASYON NO.</Column>
            </tr>
          </thead>
          <tbody>
            {passenger.passengers.map((p, idx) => (
              <tr key={idx}>
                <Column>{p.gender === 0 ? 'Bay' : 'Bayan'}</Column>
                <Column>{p.fullName}</Column>
                <Column>{dayjs(p.birthday).format('DD.MM.YYYY')}</Column>
                <Column>{p.identityNumber}</Column>
                <Column>{p.bookingCode}</Column>
              </tr>
            ))}
          </tbody>
        </Row>
        <div className='mt-1 text-xs'>
          Promosyon turlarımızda iptal ve değişiklik yapılamaz.
        </div>
      </EmailCard>

      <EmailCard title='Rota'>
        <Row className='mb-4'>
          {tour.cities.map((index) => {
            return <Column key={index.code}>{index.title}</Column>
          })}
        </Row>

        {tour.detail.tourProgram.map((item, index) => (
          <div key={index} className='mb-3'>
            <span className='font-bold'>{index + 1}. Gün: </span>
            <span dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        ))}
      </EmailCard>

      <EmailCard title='Hizmetler'>
        <Row>
          <thead>
            <tr>
              <td className='font-bold'>Ücrete Dahi Hizmetler</td>
            </tr>
            <tr>
              <td
                dangerouslySetInnerHTML={{
                  __html: tour.detail.includedInformation,
                }}
              />{' '}
            </tr>
            <tr>
              <td className='font-bold'>Ücrete Dahil Olmayan Hizmetler</td>
            </tr>
            <td
              dangerouslySetInnerHTML={{
                __html: tour.detail.notIncludedInformation,
              }}
            />
          </thead>
        </Row>
      </EmailCard>
      {((tour.hotelInformations?.[0]?.name &&
        tour.hotelInformations[0].name.trim() !== '') ||
        (tour.detail.flightInformation &&
          tour.detail.flightInformation.length > 0)) && (
        <EmailCard title='Ulaşım ve Otel Bilgileri'>
          <div>
            {tour.detail.flightInformation &&
              tour.detail.flightInformation.length > 0 && (
                <>
                  <b>Ulaşım:</b>
                  {tour.detail.flightInformation}
                </>
              )}
            {tour.detail.flightInformation &&
              tour.detail.flightInformation.length > 0 &&
              tour.hotelInformations?.[0]?.name &&
              tour.hotelInformations[0].name.trim() !== '' && <br />}
            {tour.hotelInformations?.[0]?.name &&
              tour.hotelInformations[0].name.trim() !== '' && (
                <>
                  <b>Otel:</b> {tour.hotelInformations[0].name}
                </>
              )}
          </div>
        </EmailCard>
      )}
      <EmailCard title='Fatura Bilgileri'>
        <table cellPadding={2}>
          <thead>
            <tr>
              <td width={150}>İsim Soyisim</td>
              <td>:</td>
              <td className='font-bold'>{firstPassenger.fullName}</td>
            </tr>
            <tr>
              <td>TC Kimlik No</td>
              <td>:</td>
              <td className='font-bold'>{firstPassenger.identityNumber}</td>
            </tr>
            <tr>
              <td>GSM</td>
              <td>:</td>
              <td className='font-bold'>{firstPassenger.mobilePhoneNumber}</td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td className='font-bold'>{billing?.address}</td>
            </tr>
          </thead>
        </table>
        <div className='my-2 flex items-center rounded-lg bg-blue-700 p-3 font-bold text-white'>
          <Img
            className='mr-3'
            src='https://ykmturizm.mncdn.com/11/Files/email/img/blue-info.png'
          />
          E-faturanız mail adresinize ayrıca gönderilecektir.
        </div>
      </EmailCard>

      <EmailCard title='Ödeme Bilgileri'>
        <table cellPadding={2}>
          <tr>
            <td width={150}>Toplam Fiyat</td>
            <td>:</td>
            <td className='font-bold'>{formatCurrency(payment.basketTotal)}</td>
          </tr>
          {payment.basketDiscountTotal > 0 && (
            <tr>
              <td>İndirim Tutarı</td>
              <td>:</td>
              <td className='font-bold'>
                {formatCurrency(payment.basketDiscountTotal)}
              </td>
            </tr>
          )}
          <tr>
            <td>Kredi Kartından Çekilen Tutar</td>
            <td>:</td>
            <td className='font-bold'>
              {payment.installmentCount > 1 && (
                <>{payment.installmentCount} Taksit = </>
              )}
              {formatCurrency(payment.collectingTotal)}
            </td>
          </tr>
          <tr>
            <td>Kart Numarası</td>
            <td>:</td>
            <td className='font-bold'>{payment.encryptedCardNumber}</td>
          </tr>
          <tr>
            <td>Kart Sahibi</td>
            <td>:</td>
            <td className='font-bold'>{payment.encryptedCardHolder}</td>
          </tr>
        </table>
      </EmailCard>
    </EmailBody>
  )
}

EmailTourOrderResult.PreviewProps = {
  data: __dummy__TourDummyResponsePaymentSummaryResponse,
}
