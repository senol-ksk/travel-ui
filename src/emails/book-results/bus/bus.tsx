import { Column, Heading, Row } from '@react-email/components'
import {
  BusSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { busDummyResponse } from '../_dummy-response/bus'
import { EmailCard } from '../../_components/email-card'
import { EmailBody } from '../../_components/body'
import dayjs from 'dayjs'
import { SuccessCard } from '@/emails/_components/success-card'

type IProps = {
  data: OperationResultType
}

export default function EmailBusOrderResult({ data }: IProps) {
  const { busJourney } = data.product.summaryResponse as BusSummaryResponse
  const { passenger } = data

  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />
      <EmailCard
        title={
          <Row className='w-full'>
            <Column>
              <tr>
                <td align='left'>Sefer Bilgileri</td>
                <td align='right'>
                  <img
                    sizes='50px'
                    src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${busJourney.companyId}`}
                  />
                </td>
              </tr>
            </Column>
          </Row>
        }
      >
        <Row className='w-full' cellPadding={2}>
          <Column width={180}>
            <div>Firma</div>
            <div className='font-bold'>{busJourney.company}</div>
          </Column>
          <Column width={150}>
            <div>Kalkış</div>
            <div className='font-bold'>{busJourney.origin}</div>
          </Column>
          <Column width={250}>
            <div>Varış</div>
            <div className='font-bold'>{busJourney.destination}</div>
          </Column>
          <Column width={150}>
            <div>Tarih</div>
            <div className='font-bold'>
              {dayjs(busJourney.bus.departureDate).format('DD.MM.YYYY HH:mm')}
            </div>
          </Column>
        </Row>
      </EmailCard>

      <EmailCard title='Yolcu Bilgileri'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='font-bold'>
              <Column>ÜNVAN</Column>
              <Column>ADI SOYADI</Column>
              <Column>TC. NO</Column>
              <Column>KOLTUK NO</Column>
              <Column>E-BİLET NO.</Column>
            </tr>
          </thead>

          <tbody>
            {passenger.passengers.map((passengerInfo, index) => (
              <tr key={index}>
                <Column width={80}>
                  {passengerInfo.gender == 0 ? 'Bay' : 'Bayan'}
                </Column>
                <Column width={180}>
                  {passengerInfo.firstName} {passengerInfo.lastName}
                </Column>
                <Column width={120}>
                  {dayjs(passengerInfo.birthday).format('DD.MM.YYYY')}
                </Column>
                <Column width={120}>{passengerInfo.identityNumber}</Column>
                <Column width={150}>
                  <div className='font-bold text-blue-600'>
                    {passengerInfo.eTicketNumber}
                  </div>
                </Column>
              </tr>
            ))}
          </tbody>
        </Row>
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
        <div className='my-2 flex items-center gap-2 rounded-lg bg-blue-700 p-[10px] font-bold text-white'>
          <img src='https://ykmturizm.mncdn.com/11/Files/email/img/blue-info.png' />
          E-faturanız mail adresinize ayrıca gönderilecektir.
        </div>
      </EmailCard>
      <EmailCard title='Ödeme Bilgileri'>
        <Row cellPadding={2}>
          <Column width={150}>
            <tr>
              <td>Toplam Fiyat</td>
              <td>:</td>
              <td className='font-bold'>
                {busJourney.totalPrice.value} {busJourney.totalPrice.currency}
              </td>
            </tr>
            {busJourney.discount.value > 0 && (
              <tr>
                <td>İndirim Tutarı</td>
                <td>:</td>

                <td className='font-bold'>
                  {busJourney.discount?.value || 0}{' '}
                  {busJourney.totalPrice.currency}
                </td>
              </tr>
            )}
            <tr>
              <td>Kart Bilgisi</td>
              <td>:</td>
              <td className='font-bold'>
                {passenger.paymentInformation.encryptedCardNumber}
              </td>
            </tr>
            <tr>
              <td>Tahsil edilen Tutar</td>
              <td>:</td>
              <td className='font-bold'>
                {passenger.paymentInformation.installmentCount > 1 && (
                  <>{passenger.paymentInformation.installmentCount} Taksit = </>
                )}
                {passenger.paymentInformation.collectingTotal}{' '}
                {passenger.paymentInformation.sellingCurrency}
              </td>
            </tr>
          </Column>
        </Row>
      </EmailCard>
    </EmailBody>
  )
}

// Preview için gerçek dummy data kullanımı
EmailBusOrderResult.PreviewProps = {
  data: busDummyResponse,
}
