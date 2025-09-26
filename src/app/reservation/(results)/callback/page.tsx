import { serviceRequest } from '@/network'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { CheckoutCard } from '@/components/card'
import { ModuleNames } from '@/types/global'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { HotelSummary } from './products/hotel'
import {
  BusSummaryResponse,
  CarSummaryResponse,
  FlightSummaryResponse,
  HotelSummaryResponse,
  OperationResultType,
  TransferSummaryResponse,
  TourSummaryResponse,
  CyprusPackageSummaryResponse,
} from '../../types'
import { BusSummary } from './products/bus'
import { TransferSummary } from './products/transfer'
import { FlightSummary } from '@/app/reservation/(results)/callback/products/flight'
import { notFound } from 'next/navigation'
import { resend } from '@/libs/resend'
import EmailBookResult from '@/emails/book-results'
import { CarSummary } from './products/car'
import { TourSummary } from './products/tour'
import { BillingCard } from '@/app/order-components/billing-card'
import Image from 'next/image'
import Link from 'next/link'
import { CyprusPackageSummary } from './products/cyprusPackage'
dayjs.extend(utc)

type IProps = {
  searchParams: Promise<{
    moduleName: ModuleNames
    orderId: string
    searchToken: string
    sessionToken: string
    shoppingFileId: string
    productKey: string
  }>
}

const CallbackPage: React.FC<IProps> = async ({ searchParams }) => {
  const { searchToken, sessionToken, shoppingFileId, productKey } =
    await searchParams

  if (!(searchToken || sessionToken || shoppingFileId || productKey))
    return notFound()

  const getSummaryData = await serviceRequest<OperationResultType>({
    axiosOptions: {
      // url: `api/product/summary/withshoppingfileId` as number,
      url: `api/product/summary`,
      params: {
        searchToken,
        sessionToken,
        shoppingFileId,
        productKey,
      },
    },
  })

  if (!getSummaryData?.data && !getSummaryData?.success) return notFound()

  const getSummary = getSummaryData?.data

  const passengerData = getSummary?.passenger

  const productData = getSummary?.product.summaryResponse
  if (
    getSummary &&
    getSummaryData.success &&
    getSummaryData.data?.product.summaryResponse.moduleName.length
  ) {
    resend()
      .emails.send(
        {
          from: process.env.EMAIL_FROM,
          to: getSummary.passenger.passengers[0].email,
          subject: 'Rezervasyon Bilgileriniz',
          bcc: 'islemsonuc@paraflytravel.com',
          react: EmailBookResult({
            data: getSummary,
          }),
        },
        {
          idempotencyKey: `bookResult/${getSummary.passenger.shoppingFileId}`,
        }
      )
      .then((responseData) => {
        console.log(responseData)
      })
      .catch((reason) => {
        throw new Error('An error occurred ', { cause: reason })
      })
  }

  return (
    <div className='mx-auto max-w-screen-sm pt-4'>
      {productData && passengerData ? (
        <>
          <div className='grid gap-3'>
            <div className='rounded-lg border border-green-700 p-4'>
              <div className='text-center'>
                <div className='text-green-900'>
                  <div className='flex items-center justify-center'>
                    <IoCheckmarkCircleOutline size={50} />
                  </div>
                  <h4>Rezervasyonunuz tamamlandı.</h4>
                </div>
                <div className='text-sm'>
                  Bilgilerinizi{' '}
                  <strong>
                    {passengerData?.passengers.at(0)?.email.toLocaleLowerCase()}
                  </strong>{' '}
                  e-posta adresinize gönderdik.
                </div>
                <div className='text-sm'>
                  Bizi tercih ettiğiniz için teşekkür ederiz.
                </div>
              </div>
            </div>

            <div>
              {(() => {
                switch (productData.moduleName) {
                  case 'Flight':
                    return (
                      <FlightSummary
                        data={productData as FlightSummaryResponse}
                      />
                    )
                  case 'Hotel':
                    return (
                      <HotelSummary
                        data={productData as HotelSummaryResponse}
                        passengerCount={passengerData?.passengers?.length}
                      />
                    )
                  case 'Bus':
                    return (
                      <BusSummary data={productData as BusSummaryResponse} />
                    )
                  case 'Transfer':
                    return (
                      <TransferSummary
                        data={productData as TransferSummaryResponse}
                      />
                    )
                  case 'CarRental':
                    return (
                      <CarSummary data={productData as CarSummaryResponse} />
                    )
                  case 'Tour':
                    return (
                      <TourSummary
                        data={productData as TourSummaryResponse}
                        passengerCount={passengerData?.passengers?.length}
                      />
                    )
                  case 'CyprusPackage':
                    return (
                      <CyprusPackageSummary
                        data={productData as CyprusPackageSummaryResponse}
                      />
                    )
                  default:
                    break
                }
              })()}
            </div>
            <CheckoutCard title='Yolcu Bilgileri'>
              <div className='grid gap-3'>
                <div className='grid overflow-x-auto'>
                  <div className='grid grid-cols-6 gap-3 p-1 text-sm font-bold'>
                    <div>Ünvan</div>
                    <div>Adı Soyadı</div>
                    <div>Doğum Tarihi</div>
                    <div>TC. No</div>
                    <div>Rezervasyon No.</div>
                    {productData.moduleName === 'Flight' && (
                      <div>E-Bilet No.</div>
                    )}
                  </div>
                  {passengerData.passengers.map(
                    ({
                      fullName,
                      gender,
                      identityNumber,
                      birthday,
                      bookingCode,
                      eTicketNumber,
                    }) => (
                      <div
                        key={identityNumber}
                        className='my-2 grid min-w-[800px] grid-cols-6 gap-3 p-1 text-sm hover:bg-gray-50 md:min-w-0'
                      >
                        <div className='text-sm'>
                          {gender == 0 ? 'Bay' : 'Bayan'}
                        </div>
                        <div className='text-sm'>{fullName}</div>
                        <div className='text-sm'>
                          {dayjs(birthday).format('DD.MM.YYYY')}
                        </div>
                        <div className='text-sm'>{identityNumber}</div>
                        {productData.moduleName === 'Flight' && (
                          <div className='text-sm'>{eTicketNumber}</div>
                        )}
                        <div
                          className={`text-sm ${productData.moduleName === 'Flight' ? 'col-span-1' : 'col-span-2'}`}
                        >
                          {bookingCode}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CheckoutCard>
            <CheckoutCard title='Fatura Bilgileri'>
              <BillingCard
                data={{
                  fullName: passengerData.passengers[0].fullName,
                  idNumber: passengerData.passengers[0].identityNumber,
                  gsm: passengerData.passengers[0].mobilePhoneNumber,
                  address: passengerData.billingInformation.at(0)?.address,
                }}
              />
            </CheckoutCard>
            <CheckoutCard title='Ödeme Bilgileri'>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-36 font-medium'>Toplam Fiyat</div>
                  <div>:</div>
                  <div className='font-bold'>
                    {formatCurrency(
                      passengerData.paymentInformation.basketTotal
                    )}
                  </div>
                </div>
                {passengerData.paymentInformation.basketDiscountTotal > 0 &&
                  productData.moduleName === 'Hotel' &&
                  (productData as HotelSummaryResponse).roomGroup
                    ?.earlyBooking && (
                    <div className='flex items-center gap-2'>
                      <div className='w-36 font-medium'>İndirim Tutarı</div>
                      <div>:</div>
                      <div className='font-bold text-green-600'>
                        {formatCurrency(
                          passengerData.paymentInformation.basketDiscountTotal
                        )}
                      </div>
                    </div>
                  )}
                {passengerData.paymentInformation.mlTotal &&
                  passengerData.paymentInformation.mlTotal > 0 && (
                    <div className='flex items-center gap-2'>
                      <div className='w-36 font-medium'>ParafPara TL</div>
                      <div>:</div>
                      <div className='font-bold'>
                        {formatCurrency(
                          passengerData.paymentInformation.mlTotal
                        )}
                      </div>
                    </div>
                  )}

                {productData.moduleName === 'Hotel' &&
                  (productData as HotelSummaryResponse).roomGroup
                    ?.earlyBooking && (
                    <>
                      <div className='flex items-center gap-2'>
                        <div className='w-36 font-medium'>Ön Ödeme</div>
                        <div>:</div>
                        <div className='font-bold text-blue-600'>
                          {formatCurrency(
                            passengerData.paymentInformation.collectingTotal
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-36 font-medium'>Kalan Tutar</div>
                        <div>:</div>
                        <div className='font-bold text-orange-600'>
                          {formatCurrency(
                            passengerData.paymentInformation.basketDiscountTotal
                          )}
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-36 font-medium'>Son Ödeme Tarihi</div>
                        <div>:</div>
                        <div className='font-bold'>
                          {dayjs(
                            (productData as HotelSummaryResponse).roomGroup
                              .checkInDate as string
                          )
                            .subtract(4, 'days')
                            .format('DD MMMM YYYY')}
                        </div>
                      </div>
                    </>
                  )}
                <div className='flex items-center gap-2'>
                  <div className='w-36 font-medium'>Kart Numarası</div>
                  <div>:</div>
                  <div className='font-bold'>
                    {passengerData.paymentInformation.encryptedCardNumber}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-36 font-medium'>Kart Sahibi</div>
                  <div>:</div>
                  <div className='font-bold'>
                    {passengerData.paymentInformation.encryptedCardHolder}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='w-36 font-medium'>Ödeme Yöntemi</div>
                  <div>:</div>
                  <div className='font-bold'>
                    {passengerData.paymentInformation.installmentCount > 1 ? (
                      <>
                        {passengerData.paymentInformation.installmentCount}{' '}
                        Taksit
                      </>
                    ) : (
                      'Tek Çekim'
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-36 font-medium'>
                    Kredi Kartından Çekilecek Tutar
                  </div>
                  <div>:</div>
                  <div className='font-bold'>
                    {formatCurrency(
                      Math.abs(
                        (passengerData.paymentInformation.basketTotal || 0) -
                          (passengerData.paymentInformation
                            .basketDiscountTotal || 0) -
                          (passengerData.paymentInformation.mlTotal || 0)
                      )
                    )}
                  </div>
                </div>
              </div>
            </CheckoutCard>
          </div>
          <div className='mt-3 rounded-lg border p-4 shadow-sm'>
            <div className='mb-3 text-sm font-bold'>Bilgilendirme</div>
            <ul className='space-y-2 text-sm'>
              <li>
                Satın almış olduğunuz seyahatinizi iptal etmeniz durumunda,
                Acente tarafından alınan hizmet bedeli iade edilmemektedir.
              </li>
              <li>
                Detaylı bilgi için haftanın her günü 09:00-18:00 saatleri
                arasında 0850 878 0 400 nolu telefondan Müşteri Hizmetlerimize
                ulaşabilirsiniz.
              </li>
              <li>
                Muhasebe işlemleri için{' '}
                <a
                  href='mailto:muhasebe@ykmturizm.com.tr'
                  className='text-blue-600 underline hover:text-blue-800'
                >
                  muhasebe@ykmturizm.com.tr
                </a>{' '}
                mail adresinden detaylı bilgi alabilirsiniz.
              </li>
            </ul>
          </div>

          <div className='mt-3 flex justify-center'>
            <Link
              href='https://whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
              className='inline-flex items-center gap-3 rounded-lg border border-green-800 p-3 text-black no-underline hover:bg-green-50'
            >
              <Image
                src='https://ykmturizm.mncdn.com/11/Files/email/img/whatsp.png'
                alt='WhatsApp'
                width={24}
                height={24}
              />
              <span>Whatsapp kanalımızı takip edin</span>
            </Link>
          </div>

          <div className='mt-6 text-center text-xs'>
            <p className='mx-auto max-w-3xl'>
              Paraflytravel.com sitesinin tüm seyahat hizmetleri Yeni Karamürsel
              Turizm ve Seyahat Acentası tarafından haftanın her günü 09:00 -
              18:00 saatleri arasında verilmektedir.
            </p>
            <div className='mx-auto mt-4 max-w-md'>
              <div className='font-bold'>
                <strong>Karya Tur Seyahat Acenteliği A.Ş</strong>
              </div>
              <div>
                İcadiye, Cumhuriyet Cad. No:167/5, 34674 Üsküdar / İstanbul
              </div>
              <div>Mersis No: 0948006409700018</div>
            </div>
          </div>
        </>
      ) : (
        'No data received or an error occurred'
      )}
    </div>
  )
}

export default CallbackPage
