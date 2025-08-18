import { Column, Img, Row } from '@react-email/components'
import dayjs from 'dayjs'
import {
  CarSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { EmailBody } from '@/emails/_components/body'
import { EmailCard } from '@/emails/_components/email-card'
import { SuccessCard } from '@/emails/_components/success-card'
import { __dummy__carRentalPaymentSummaryResponse } from '../_dummy-response/car'
import { formatCurrency } from '@/libs/util'

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

  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />

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
                  <td>Ekstralar</td>
                  <td>:</td>
                  <td>
                    {car.navigationSystem?.isAvailable ? 'Navigasyon' : '—'}
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
                <Column>
                  {p.firstName} {p.lastName}
                </Column>
                <Column>{dayjs(p.birthday).format('DD.MM.YYYY')}</Column>
                <Column>{p.identityNumber}</Column>
                <Column>{data.passenger.shoppingFileId}</Column>
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
        <table cellPadding={2}>
          <thead>
            <tr>
              <td width={150}>İsim Soyisim</td>
              <td>:</td>
              <td className='font-bold'>
                {data.passenger.passengers.at(0)?.fullName}
              </td>
            </tr>
            <tr>
              <td>TC. Kimlik No</td>
              <td>:</td>
              <td className='font-bold'>
                {data.passenger.passengers.at(0)?.identityNumber}
              </td>
            </tr>
            <tr>
              <td>GSM</td>
              <td>:</td>
              <td className='font-bold'>
                {data.passenger.passengers.at(0)?.mobilePhoneNumber}
              </td>
            </tr>
            <tr>
              <td>Adres</td>
              <td>:</td>
              <td className='font-bold'>
                {data.passenger.billingInformation.at(0)?.address}
              </td>
            </tr>
          </thead>
        </table>
        <div className='my-2 flex items-center rounded-lg bg-blue-700 p-3 font-bold text-white'>
          <Img
            className='mr-3'
            src='https://ykmturizm.mncdn.com/11/Files/email/img/blue-info.png'
            alt='Bilgi ikonu'
          />
          E-faturanız mail adresinize ayrıca gönderilecektir.
        </div>
      </EmailCard>

      <EmailCard title={'Ödeme Bilgileri'}>
        <table cellPadding={2}>
          <tbody>
            <tr>
              <td width={150}>Toplam Fiyat</td>
              <td>:</td>
              <td className='font-bold'>
                {formatCurrency(detail.totalPrice.value)}
              </td>
            </tr>
            {detail.discount.value > 0 ? (
              <tr>
                <td>İndirim Tutarı</td>
                <td>:</td>
                <td className='font-bold'>
                  {detail.discount.value} {detail.discount.currency}
                </td>
              </tr>
            ) : null}
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
                {passenger.paymentInformation.installmentCount > 1 ? (
                  <>{passenger.paymentInformation.installmentCount} Taksit = </>
                ) : null}
                {passenger.paymentInformation.collectingTotal}{' '}
                {passenger.paymentInformation.sellingCurrency}
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
