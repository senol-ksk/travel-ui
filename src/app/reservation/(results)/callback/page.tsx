import { serviceRequest } from '@/network'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import { CheckoutCard } from '@/components/card'

import { ModuleNames } from '@/types/global'
import { Divider, Title } from '@mantine/core'
import {
  GenderEnumIndex,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'
import { formatCurrency } from '@/libs/util'
// import { FlightSummary } from './products/flight'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { HotelSummary } from './products/hotel'
import {
  BusSummaryResponse,
  FlightSummaryResponse,
  HotelSummaryResponse,
  OperationResultType,
  TransferSummaryResponse,
} from '../../types'
import { BusSummary } from './products/bus'
import { TransferSummary } from './products/transfer'
import { FlightSummary } from '@/app/reservation/(results)/callback/products/flight'
import { BsFillCreditCardFill } from 'react-icons/bs'
import { notFound } from 'next/navigation'
import { resend } from '@/libs/resend'
import EmailFlightBookResult from '@/emails/book-results/flight/flight'
import EmailBookResult from '@/emails/book-results'

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

  if (getSummary && getSummaryData.success) {
    resend()
      .emails.send(
        {
          from: process.env.EMAIL_FROM,
          to:
            process.env.NODE_ENV === 'development'
              ? 'senolk@lidyateknoloji.com'
              : getSummary.passenger.passengers[0].email,

          subject: 'Rezervasyon Bilgileriniz',
          react: EmailBookResult({
            data: getSummary,
          }),
        },
        {
          idempotencyKey: `bookResult/${getSummary.passenger.shoppingFileId}`,
        }
      )
      .then((responseData) => {
        console.log('email send response => ', responseData)
      })
      .catch((reason) => {
        console.log('email send error => ', reason)
      })
  }

  return (
    <div className='mx-auto max-w-screen-sm pt-4'>
      {productData && passengerData ? (
        <div className='grid gap-3'>
          <CheckoutCard>
            <div className='text-center'>
              <div className='text-green-900'>
                <div className='flex items-center justify-center'>
                  <IoCheckmarkCircleOutline size={50} />
                </div>
                <h4>Rezervasyonunuz tamamlandı.</h4>
              </div>
              <div>
                Bilgilerinizi{' '}
                <strong>
                  {passengerData?.passengers.at(0)?.email.toLocaleLowerCase()}
                </strong>{' '}
                e-posta adresinize gönderdik.
              </div>
              <div>Bizi tercih ettiğiniz için teşekkür ederiz.</div>
            </div>
          </CheckoutCard>
          <div className='text-xs'>
            Rezervasyon oluşturulma tarihi:{' '}
            <strong>
              {dayjs(passengerData.bookingDateTime).format(
                'DD MMMM YYYY HH:mm'
              )}
            </strong>
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
                    <HotelSummary data={productData as HotelSummaryResponse} />
                  )
                case 'Bus':
                  return <BusSummary data={productData as BusSummaryResponse} />
                case 'Transfer':
                  return (
                    <TransferSummary
                      data={productData as TransferSummaryResponse}
                    />
                  )

                default:
                  break
              }
            })()}
          </div>
          <CheckoutCard>
            <div className='grid gap-3'>
              <Title order={4} m={0}>
                Yolcu Bilgileri
              </Title>
              <Divider m={0} />
              <div className='grid gap-3 text-sm md:grid-cols-3'>
                {passengerData?.passengers?.map((passenger) => {
                  return (
                    <div
                      key={passenger.productItemId}
                      className='rounded border border-gray-400 p-2'
                    >
                      <div>
                        {GenderEnumIndex[passenger.gender]}{' '}
                        {PassengerTypesIndexEnum[passenger.type]}
                      </div>
                      <div>{passenger.fullName}</div>
                      <div>
                        <strong>TC no: </strong>
                        {passenger.identityNumber}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CheckoutCard>
          <CheckoutCard>
            <div className='grid gap-3'>
              <Title order={4} className='m-0'>
                Ödeme Bilgileri
              </Title>
              <Divider />
              <div className='grid justify-between gap-3 text-sm md:grid-cols-2'>
                {passengerData?.paymentInformation?.encryptedCardNumber && (
                  <div className='text-sm'>
                    <Title order={5}>Ödeme Aracı</Title>
                    <div>
                      {passengerData?.paymentInformation?.bankName}, Sonu{' '}
                      {passengerData?.paymentInformation?.encryptedCardNumber.slice(
                        -4
                      )}{' '}
                      ile biten.
                    </div>
                  </div>
                )}
                <div className='grid grid-cols-2 gap-2'>
                  <div>Toplam Tutar:</div>
                  <div className='text-end'>
                    {formatCurrency(
                      passengerData?.paymentInformation?.basketTotal || 0
                    )}
                  </div>
                  {passengerData?.paymentInformation?.basketDiscountTotal &&
                  passengerData?.paymentInformation?.basketDiscountTotal > 0 ? (
                    <>
                      <div>Uygulanan indirim:</div>
                      <div className='text-end'>
                        {formatCurrency(
                          passengerData.paymentInformation.basketDiscountTotal
                        )}
                      </div>
                    </>
                  ) : null}
                  <div>Tahsil edilen tutar:</div>
                  <div className='text-end'>
                    {formatCurrency(
                      passengerData.paymentInformation.basketTotal -
                        passengerData.paymentInformation.basketDiscountTotal
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CheckoutCard>
        </div>
      ) : (
        'No data received or an error occurred'
      )}
    </div>
  )
}

export default CallbackPage
