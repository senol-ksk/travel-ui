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
import {
  FlightSummaryResponse,
  OperationSuccessResultType,
} from './flight-type'
import { ModuleNames } from '@/types/global'
import { AspectRatio, Divider, Image, Title } from '@mantine/core'
import {
  GenderEnumIndex,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'
import { formatCurrency } from '@/libs/util'
import { FlightSummary } from './products/flight'

const CallbackPage: React.FC<IProps> = async ({ searchParams }) => {
  const { searchToken, sessionToken, shoppingFileId } = await searchParams
  const getSummaryData = await serviceRequest<OperationSuccessResultType>({
    axiosOptions: {
      // url: `api/product/summary/withshoppingfileId`,
      url: `api/product/summary`,
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

  const productData = getSummary?.product
    .summaryResponse as FlightSummaryResponse
  const passengerData = getSummary?.passenger

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
          <div>
            <FlightSummary data={productData} />
          </div>
          <CheckoutCard>
            <Title order={3}>Yolcu Bilgileri</Title>
            <Divider />
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
                  {passengerData?.paymentInformation?.bankName}, Sonu{' '}
                  {passengerData?.paymentInformation?.encryptedCardNumber.slice(
                    -4
                  )}{' '}
                  ile biten.
                </div>
              </div>
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
          </CheckoutCard>
        </div>
      ) : (
        'No data received or an error occurred'
      )}
    </div>
  )
}

export default CallbackPage
