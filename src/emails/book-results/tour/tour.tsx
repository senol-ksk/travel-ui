import { Column, Heading, Img, Row, Link } from '@react-email/components'
import { OperationResultType } from '@/app/reservation/types'
import { EmailBody } from '../../_components/body'
import { EmailCard } from '../../../app/order-components/email-card'
import { SuccessCard } from '@/app/order-components/success-card'
import { formatCurrency } from '@/libs/util'
import { __dummy__TourDummyResponsePaymentSummaryResponse } from '../_dummy-response/tour'
import dayjs from 'dayjs'
import { TourSummaryViewData } from '@/types/passengerViewModel'
import { Spoiler } from '@mantine/core'
import { BillingCard } from '@/app/order-components/billing-card'

type IProps = {
  data: OperationResultType
}

export default function EmailTourOrderResult({ data }: IProps) {
  const { passenger, product } = data
  const tour = (product.summaryResponse as TourSummaryViewData).package
  const billing = passenger.billingInformation[0]
  const payment = passenger.paymentInformation
  const firstPassenger = passenger.passengers[0]
  return (
    <EmailBody>
      <SuccessCard name={firstPassenger.fullName} />
      <Link
        href={`${process.env.SITE_URL}/kampanyalar?categoryId=233`}
        target='_blank'
      >
        <Img
          width={800}
          height={200}
          className='my-3'
          src='https://ykmturizm.mncdn.com/11/Files/638935150943482316.png'
        />
      </Link>
      <EmailCard title='Tur Bilgisi'>
        <table cellPadding={4}>
          <tr>
            <td width={310} valign='top'>
              <Img
                className='rounded-lg'
                width={310}
                height={200}
                src={tour.imageUrl}
                alt={tour.title}
              />
            </td>
            <td valign='top'>
              <span className='text-lg font-bold'>{tour.title}</span>
              <table cellPadding={4}>
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
                  <tr>
                    <td>Süre</td>
                    <td>:</td>
                    <td>{tour.tourTime} Gün</td>
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
                  {tour.group &&
                    tour.group.title &&
                    tour.group.title.trim() !== '' && (
                      <tr>
                        <td>Grup</td>
                        <td>:</td>
                        <td>{tour.group.title}</td>
                      </tr>
                    )}
                  {tour.region &&
                    tour.region.title &&
                    tour.region.title.trim() !== '' && (
                      <tr>
                        <td>Bölge</td>
                        <td>:</td>
                        <td>{tour.region.title}</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </td>
          </tr>
        </table>
      </EmailCard>

      <EmailCard title='Yolcu Bilgileri'>
        <Row cellPadding={6}>
          <thead>
            <tr className='text-xs font-bold'>
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
        <BillingCard
          data={{
            fullName: firstPassenger.fullName,
            idNumber: firstPassenger.identityNumber,
            gsm: firstPassenger.mobilePhoneNumber,
            address: billing?.address,
          }}
        />
      </EmailCard>

      <EmailCard title='Ödeme Bilgileri'>
        <table cellPadding={4}>
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
                -{formatCurrency(payment.basketDiscountTotal)}
              </td>
            </tr>
          )}
          {payment.mlTotal && payment.mlTotal > 0 && (
            <tr>
              <td>ParafPara TL</td>
              <td>:</td>
              <td className='font-bold'>{formatCurrency(payment.mlTotal)}</td>
            </tr>
          )}
          <tr>
            <td>Kredi Kartından Çekilen Tutar</td>
            <td>:</td>
            <td className='font-bold'>
              {payment.installmentCount > 1 ? (
                <>{payment.installmentCount} Taksit = </>
              ) : null}
              {formatCurrency(
                payment.basketTotal -
                  (payment.basketDiscountTotal || 0) -
                  (payment.mlTotal || 0)
              )}{' '}
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
