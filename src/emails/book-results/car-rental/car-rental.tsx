import { Column, Img, Row, Link } from '@react-email/components'

import dayjs from 'dayjs'
import {
  CarSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { EmailBody } from '@/emails/_components/body'
import { EmailCard } from '@/app/order-components/email-card'
import { SuccessCard } from '@/app/order-components/success-card'
import { __dummy__carRentalPaymentSummaryResponse } from '../_dummy-response/car'
import { formatCurrency } from '@/libs/util'
import { BillingCard } from '@/app/order-components/billing-card'

type IProps = {
  data: OperationResultType
}

function getFuelLabel(fuelType?: number) {
  switch (fuelType) {
    case 1:
      return 'Benzin'
    case 2:
      return 'Dizel'
    case 3:
      return 'LPG'
    case 4:
      return 'Hibrit'
    case 5:
      return 'Elektrik'
    case 6:
      return 'Dizel'
    default:
      return '—'
  }
}

export default function EmailCarRentalOrderResult({ data }: IProps) {
  const summary = data.product.summaryResponse as CarSummaryResponse
  const detail = summary.detailResponse.items[0]
  const car = detail.carDetail
  const { passenger } = data

  const pickup = summary.pickupStation
  const drop = summary.returnStation

  const dayCount = Math.max(
    dayjs(car.returnDate).diff(car.pickupDate, 'day'),
    1
  )
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
      <EmailCard title={'Araç Bilgisi'}>
        <Row>
          <Column width={220} valign={'top'}>
            <Img src={car.imageUrl} alt={car.name} width={200} />
          </Column>
          <Column valign={'top'}>
            <div>
              <strong>
                {car.brand ? `${car.brand} ` : ''}
                {car.name}, {car.carGroupName}
              </strong>
            </div>
            <table cellPadding={4}>
              <tbody>
                <tr>
                  <td>Özellikler</td>
                  <td>:</td>
                  <td>
                    {car.airConditioning ? 'Klima Var' : 'Klima Yok'},{' '}
                    {car.automaticTransmission
                      ? 'Otomatik Vites'
                      : 'Manuel Vites'}
                    , {car.seatCount} koltuk , {getFuelLabel(car.fuelType)}
                  </td>
                </tr>
                <tr>
                  <td>Süre</td>
                  <td>:</td>
                  <td>{dayCount} Gün</td>
                </tr>
                <tr>
                  <td>Firma</td>
                  <td>:</td>
                  <td>{car.vendorName}</td>
                </tr>
              </tbody>
            </table>
          </Column>
        </Row>
      </EmailCard>

      <EmailCard title={'Alış Yeri ve Tarihi'}>
        <table cellPadding={4}>
          <tbody>
            <tr>
              <td width={150}>Tarih</td>
              <td>:</td>
              <td>
                {dayjs(car.pickupDate).format('DD MMMM YYYY, dddd')} Saat:{' '}
                {dayjs(car.pickupDate).format('HH:mm')}
              </td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td>{pickup.location.name}</td>
            </tr>
            <tr>
              <td>Adres Detay</td>
              <td>:</td>
              <td>{pickup.address.addressName}</td>
            </tr>
            {pickup.phoneNumbers[0].number && (
              <tr>
                <td>Ofis Telefonu</td>
                <td>:</td>
                <td>{pickup.phoneNumbers[0].number}</td>
              </tr>
            )}
          </tbody>
        </table>
      </EmailCard>

      <EmailCard title={'Bırakış Yeri ve Tarihi'}>
        <table cellPadding={4}>
          <tbody>
            <tr>
              <td width={150}>Tarih</td>
              <td>:</td>
              <td>
                {dayjs(car.returnDate).format('DD MMMM YYYY, dddd')} Saat:{' '}
                {dayjs(car.returnDate).format('HH:mm')}
              </td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td>{drop.location.name}</td>
            </tr>
            <tr>
              <td>Adres Detay</td>
              <td>:</td>
              <td>{drop.address.addressName}</td>
            </tr>
            {drop.phoneNumbers[0].number && (
              <tr>
                <td>Ofis Telefonu</td>
                <td>:</td>
                <td>{drop.phoneNumbers[0]?.number || ''}</td>
              </tr>
            )}
          </tbody>
        </table>
      </EmailCard>

      <EmailCard title={'Sürücü Bilgileri'}>
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
                <Column>
                  {p.firstName} {p.lastName}
                </Column>
                <Column>{dayjs(p.birthday).format('DD.MM.YYYY')}</Column>
                <Column>{p.identityNumber}</Column>
                <Column>{p.bookingCode}</Column>
              </tr>
            ))}
          </tbody>
        </Row>
      </EmailCard>

      <EmailCard title={'Koşullar'}>
        <div>
          Araç kiralama ofisi Findeks notunuza göre seçmiş olduğunuz araç
          grubunu değiştirme hakkını saklı tutar (Findeks Kredi Notu,
          bankalardan kullanmış olduğunuz bireysel nitelikli tüm kredi ve kredi
          kartı hesaplarının geçmiş verilerinin üzerinden oluşturulur) Araç
          tesliminde sorun yaşanmaması için lütfen aracı teslim almadan önce
          Findeks notu sorgulaması yaptırınız. Findeks notunuzu 444 00 76 nolu
          telefonu arayarak sorgulatabilirsiniz.
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
      {(() => {
        const carExtraOptions = detail.carExtraOption
        const carInsurances = detail.carInsurances
        const hasSelectedExtras =
          carExtraOptions?.some((option) => option.selected) ||
          carInsurances?.some((insurance) => insurance.selected)

        return hasSelectedExtras ? (
          <EmailCard title={'Ekstra Seçenekler'}>
            <table cellPadding={4}>
              <tbody>
                {carInsurances
                  ?.filter((insurance) => insurance.selected)
                  .map((insurance, index) => (
                    <tr key={`insurance-${index}`}>
                      <td>{insurance.description}</td>
                      <td>:</td>
                      <td>
                        {insurance.isFree
                          ? 'Ücretsiz'
                          : `${insurance.totalPrice.value} ${insurance.totalPrice.currency}`}
                      </td>
                    </tr>
                  ))}
                {carExtraOptions
                  ?.filter((option) => option.selected)
                  .map((option, index) => (
                    <tr key={`extra-${index}`}>
                      <td>{option.name}</td>
                      <td>:</td>
                      <td className='font-bold'>
                        {option.isFree
                          ? 'Ücretsiz'
                          : `${formatCurrency(option.totalPrice.value)}`}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </EmailCard>
        ) : null
      })()}
      <EmailCard title={'Ödeme Bilgileri'}>
        <table cellPadding={4}>
          <tbody>
            <tr>
              <td width={150}>Toplam Fiyat</td>
              <td>:</td>
              <td className='font-bold'>
                {formatCurrency(detail.totalPrice.value)}
              </td>
            </tr>
            {passenger.paymentInformation.basketDiscountTotal > 0 ? (
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
            ) : null}
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
              <td>Kredi Kartından Çekilecek Tutar</td>
              <td>:</td>
              <td className='font-bold'>
                {passenger.paymentInformation.installmentCount > 1 ? (
                  <>{passenger.paymentInformation.installmentCount} Taksit = </>
                ) : null}
                {formatCurrency(
                  detail.totalPrice.value -
                    (passenger.paymentInformation.basketDiscountTotal || 0) -
                    (passenger.paymentInformation.mlTotal || 0)
                )}{' '}
              </td>
            </tr>
          </tbody>
        </table>
      </EmailCard>
    </EmailBody>
  )
}

// Preview için dummy data
EmailCarRentalOrderResult.PreviewProps = {
  data: __dummy__carRentalPaymentSummaryResponse as unknown as OperationResultType,
}
