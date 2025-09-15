import { Column, Img, Row, Link } from '@react-email/components'
import dayjs from 'dayjs'
import {
  TransferSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { EmailBody } from '@/emails/_components/body'
import { EmailCard } from '@/app/order-components/email-card'
import { SuccessCard } from '@/app/order-components/success-card'
import { __dummy__TransferDummyResponsePaymentSummaryResponse } from '../_dummy-response/transfer'
import { formatCurrency } from '@/libs/util'
import { BillingCard } from '@/app/order-components/billing-card'

type IProps = {
  data: OperationResultType
}

export default function EmailTransferOrderResult({ data }: IProps) {
  const summary = data.product.summaryResponse as TransferSummaryResponse
  const { selectResponse } = summary
  const { transferVehicle } = selectResponse
  const { passenger } = data
  const passengerInfo = passenger.passengers[0]
  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          width={800}
          height={200}
          className='my-3'
          src='https://ykmturizm.mncdn.com/11/Files/638932871618301570.png'
        />
      </Link>
      <EmailCard title='Transfer Bilgisi'>
        <Row>
          <Column width={320} valign='top'>
            <Img
              className='rounded-lg'
              src={transferVehicle.transferInfo.vehiclePhotoUrl}
              alt={transferVehicle.vehicleName}
              width={300}
            />
          </Column>
          <Column valign='top'>
            <div>
              <strong>{transferVehicle.vehicleName}</strong>
            </div>
            <div>
              Maks. {transferVehicle.transferInfo.transferMax.pax} Yolcu, Maks.{' '}
              {transferVehicle.transferInfo.transferMax.suitcase} Bavul
            </div>
            <table cellPadding={4}>
              <tbody>
                <tr>
                  <td>
                    Son {transferVehicle.transferInfo.transferHour.freeCancel}{' '}
                    saate kadar iptal ve değişiklik
                  </td>
                </tr>
                {transferVehicle.transferData.bookDetail.extraServices &&
                  transferVehicle.transferData.bookDetail.extraServices.length >
                    0 &&
                  transferVehicle.transferData.bookDetail.extraServices.map(
                    (service, index) => (
                      <tr key={index}>
                        <td>
                          {service.title ||
                            service.description ||
                            'Ekstra Hizmet'}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </Column>
        </Row>
      </EmailCard>

      <EmailCard title='Alış Yeri ve Tarihi'>
        <table cellPadding={4}>
          <tbody>
            <tr>
              <td width={150}>Tarih</td>
              <td>:</td>
              <td>{dayjs(selectResponse.pickupDate).format('DD MMM YYYY')}</td>
            </tr>
            <tr>
              <td>Saat</td>
              <td>:</td>
              <td>{dayjs(selectResponse.pickupDate).format('HH:mm')}</td>
            </tr>
            <tr>
              <td>Konum</td>
              <td>:</td>
              <td>{selectResponse.pickupPointName}</td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td>{selectResponse.pickupInfo}</td>
            </tr>
          </tbody>
        </table>
      </EmailCard>

      <EmailCard title='Varış Yeri ve Tarihi'>
        <table cellPadding={4}>
          <tbody>
            <tr>
              <td width={150}>Tarih</td>
              <td>:</td>
              <td>{dayjs(selectResponse.pickupDate).format('DD MMM YYYY')}</td>
            </tr>
            <tr>
              <td>Konum</td>
              <td>:</td>
              <td>{selectResponse.dropPointName}</td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td>{selectResponse.dropInfo}</td>
            </tr>
          </tbody>
        </table>
      </EmailCard>

      <EmailCard title='Yolcu Bilgileri'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='text-xs font-bold'>
              <Column>ÜNVAN</Column>
              <Column>ADI SOYADI</Column>
              <Column>DOĞUM TARİHİ</Column>
              <Column>TC. NO</Column>
              <Column>REZERVASYON NO</Column>
            </tr>
          </thead>
          <tbody>
            {passenger.passengers.map((passengerInfo, index) => (
              <tr key={index}>
                <Column width={80}>
                  {passengerInfo.gender === 0 ? 'Bay' : 'Bayan'}
                </Column>
                <Column width={180}>
                  {passengerInfo.firstName} {passengerInfo.lastName}
                </Column>
                <Column width={120}>
                  {dayjs(passengerInfo.birthday).format('DD.MM.YYYY')}
                </Column>
                <Column width={120}>{passengerInfo.identityNumber}</Column>
                <Column width={150}>
                  <div>{passengerInfo.bookingCode}</div>
                </Column>
              </tr>
            ))}
          </tbody>
        </Row>
      </EmailCard>

      <EmailCard title='Açıklama ve Notlar'>
        <div>
          <div className='mt-3 font-bold'>Alış Yeri Adres Bilgisi</div>
          <div>{selectResponse.pickupDescription}</div>

          <div className='mt-3 font-bold'>Varış Yeri Adres Bilgisi</div>
          <div>{selectResponse.dropDescription}</div>
        </div>
      </EmailCard>

      {transferVehicle.transferData.bookDetail.extraServices &&
        transferVehicle.transferData.bookDetail.extraServices.length > 0 && (
          <EmailCard title='Ekstra Hizmetler'>
            <table cellPadding={4}>
              <tbody>
                {transferVehicle.transferData.bookDetail.extraServices.map(
                  (service, index) => (
                    <tr key={index}>
                      <td width={200}>
                        {service.title ||
                          service.description ||
                          'Ekstra Hizmet'}
                      </td>
                      <td>:</td>
                      <td className='font-bold'>
                        {service.priceWithMarkup.amount === 0
                          ? 'Ücretsiz'
                          : `${formatCurrency(service.priceWithMarkup.amount)} ${service.priceWithMarkup.transferCurrencyType === 1 ? 'TL' : 'USD'}`}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </EmailCard>
        )}

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
        <table cellPadding={4}>
          <tr>
            <td width={150}>Toplam Fiyat</td>
            <td>:</td>
            <td className='font-bold'>
              {formatCurrency(passenger.paymentInformation.basketTotal)}
            </td>
          </tr>
          {passenger.paymentInformation.basketDiscountTotal > 0 && (
            <tr>
              <td>İndirim Tutarı</td>
              <td>:</td>
              <td className='font-bold'>
                -
                {formatCurrency(
                  passenger.paymentInformation.basketDiscountTotal
                )}
              </td>
            </tr>
          )}
          {passenger.paymentInformation.mlTotal &&
            passenger.paymentInformation.mlTotal > 0 && (
              <tr>
                <td>ParafPara TL</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(passenger.paymentInformation.mlTotal)}
                </td>
              </tr>
            )}
          <tr>
            <td>Ödeme Yöntemi</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.installmentCount > 1 ? (
                <>{passenger.paymentInformation.installmentCount} Taksit</>
              ) : (
                'Tek Çekim'
              )}
            </td>
          </tr>
          <tr>
            <td>Kredi Kartından Çekilen Tutar</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.installmentCount > 1 && (
                <>{passenger.paymentInformation.installmentCount} Taksit =</>
              )}
              {formatCurrency(
                Math.abs(
                  passenger.paymentInformation.basketTotal -
                    (passenger.paymentInformation.basketDiscountTotal || 0) -
                    (passenger.paymentInformation.mlTotal || 0)
                )
              )}
            </td>
          </tr>
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
        </table>
      </EmailCard>
    </EmailBody>
  )
}
EmailTransferOrderResult.PreviewProps = {
  data: __dummy__TransferDummyResponsePaymentSummaryResponse.data,
}
