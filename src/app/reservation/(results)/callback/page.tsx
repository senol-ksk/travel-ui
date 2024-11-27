import { serviceRequest } from '@/network'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import dayjs from 'dayjs'
import { CheckoutCard } from '@/components/card'
import { CabinTypes } from '@/types/flight'

type IProps = {
  searchParams: Promise<{
    moduleName: string
    orderId: string
    searchToken: string
    sessionToken: string
    shoppingFileId: string
  }>
}

import dummyData from './dummy-result.json'
import { FlightPaymentResultType } from './flight-type'
import { ModuleNames } from '@/types/global'
import { AspectRatio, Divider, Image, Title } from '@mantine/core'
import {
  GenderEnumIndex,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'
import NextImage from 'next/image'
import { formatCurrency } from '@/libs/util'

const CallbackPage: React.FC<IProps> = async ({ searchParams }) => {
  const { searchToken, sessionToken, shoppingFileId } = await searchParams
  const getSummaryData = await serviceRequest<FlightPaymentResultType>({
    axiosOptions: {
      url: `/api/product/summary`,
      withCredentials: true,
      params: {
        searchToken,
        sessionToken,
        shoppingFileId,
      },
    },
  })

  // const getSummary = dummyData as FlightPaymentResultType
  const getSummary = getSummaryData?.data
  console.log(getSummaryData)

  const productData = getSummary?.data.dataViewResponsers[0].summaryResponse
  const passengerData =
    getSummary?.data.dataViewResponsers[1].operationResultViewData.passengers
  const paymentData = {
    billingInformation:
      getSummary?.data.dataViewResponsers[1].operationResultViewData
        .billingInformation,
    paymentInformation:
      getSummary?.data.dataViewResponsers[1].operationResultViewData
        .paymentInformation,
  }

  return (
    <div className='mx-auto max-w-screen-sm pt-4'>
      {getSummary?.data || getSummary?.success ? (
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
                  {getSummary.data.dataViewResponsers[1].operationResultViewData.passengers[0].email.toLocaleLowerCase()}
                </strong>{' '}
                e-posta adresinize gönderdik.
              </div>
              <div>Bizi tercih ettiğiniz için teşekkür ederiz.</div>
            </div>
          </CheckoutCard>
          <div>
            {productData?.flightList.map((flight) => {
              return (
                <div key={flight.flightDetail.key}>
                  <CheckoutCard>
                    <div className='grid gap-3'>
                      <div className='flex justify-between gap-2'>
                        <h3 className='m-0'>
                          {flight.flightDetail.groupId === 0
                            ? 'Gidiş Uçuşu'
                            : 'Dönüş Uçuşu'}
                        </h3>
                        <div>
                          {dayjs(
                            flight.flightSegments.at(0)?.departureTime
                          ).format('DD MMM YYYY')}
                        </div>
                      </div>
                      <Divider />
                      <div className='flex items-center gap-2'>
                        <div className='relative h-[30px] w-[30px]'>
                          <AspectRatio>
                            <Image
                              component={NextImage}
                              alt={
                                flight.flightSegments[0].marketingAirline.value
                              }
                              src={`https://fulltripstatic.mncdn.com/a/airlines/${flight.flightSegments[0].marketingAirline.code}.png?width=auto`}
                              fill
                            />
                          </AspectRatio>
                        </div>
                        <div>
                          {flight.flightSegments[0].marketingAirline.value} -{' '}
                          {flight.flightSegments[0].flightNumber}
                        </div>
                        <div>
                          {CabinTypes[flight.flightSegments[0].cabinClass]}
                        </div>
                      </div>
                      <div className='flex'>
                        <div className='text-lg font-semibold'>
                          {dayjs(flight.flightSegments[0].departureTime).format(
                            'HH:mm'
                          )}
                        </div>
                        <div className='mx-6 flex flex-1 items-center'>
                          <div className='w-full rounded-2xl border-t-2 border-green-800'></div>
                        </div>
                        <div className='text-lg font-semibold'>
                          {dayjs(flight.flightSegments[0].arrivalTime).format(
                            'HH:mm'
                          )}
                        </div>
                      </div>
                      <div className='flex justify-between'>
                        <div>
                          {
                            getSummary.data.dataViewResponsers[0]
                              .summaryResponse.airportList[
                              flight.flightSegments[0].origin.code
                            ].city
                          }{' '}
                          (
                          {
                            getSummary.data.dataViewResponsers[0]
                              .summaryResponse.airportList[
                              flight.flightSegments[0].origin.code
                            ].code
                          }
                          )
                        </div>
                        <div>
                          {
                            getSummary.data.dataViewResponsers[0]
                              .summaryResponse.airportList[
                              flight.flightSegments[0].destination.code
                            ].city
                          }{' '}
                          (
                          {
                            getSummary.data.dataViewResponsers[0]
                              .summaryResponse.airportList[
                              flight.flightSegments[0].destination.code
                            ].code
                          }
                          )
                        </div>
                      </div>
                      <Divider />
                      <div className='text-sm'>
                        {flight.flightSegments[0].flightTime.split(':').at(0)}
                        sa{' '}
                        {flight.flightSegments[0].flightTime.split(':').at(1)}
                        dk
                      </div>
                    </div>
                  </CheckoutCard>
                </div>
              )
            })}
          </div>
          <CheckoutCard>
            <Title order={3}>Yolcu Bilgileri</Title>
            <Divider />
            <div className='grid gap-3 text-sm md:grid-cols-3'>
              {passengerData?.map((passenger) => {
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
          </CheckoutCard>
          <CheckoutCard>
            <Title order={3} className='m-0'>
              Ödeme Bilgileri
            </Title>
            <Divider />
            <div className='grid justify-between gap-3 text-sm md:grid-cols-2'>
              <div className='text-sm'>
                <Title order={5}>Ödeme Aracı</Title>
                <div>
                  {paymentData?.paymentInformation?.bankName}, Sonu{' '}
                  {paymentData?.paymentInformation?.encryptedCardNumber.slice(
                    -4
                  )}{' '}
                  ile biten.
                </div>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div>Toplam Tutar:</div>
                <div className='text-end'>
                  {formatCurrency(
                    paymentData?.paymentInformation?.basketTotal || 0
                  )}
                </div>
                {paymentData?.paymentInformation?.basketDiscountTotal &&
                paymentData?.paymentInformation?.basketDiscountTotal > 0 ? (
                  <>
                    <div>Uygulanan indirim:</div>
                    <div className='text-end'>
                      {formatCurrency(
                        paymentData?.paymentInformation.basketDiscountTotal
                      )}
                    </div>
                  </>
                ) : null}
                <div>Tahsil edilen tutar:</div>
                <div className='text-end'>
                  {paymentData?.paymentInformation?.basketTotal &&
                  paymentData?.paymentInformation?.basketDiscountTotal
                    ? formatCurrency(
                        paymentData?.paymentInformation?.basketTotal -
                          paymentData?.paymentInformation?.basketDiscountTotal
                      )
                    : null}
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
