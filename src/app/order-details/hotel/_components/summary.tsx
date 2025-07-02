'use client'

import {
  HotelBookingDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { formatCurrency } from '@/libs/util'
import { serviceRequest } from '@/network'
import {
  Alert,
  Button,
  Container,
  Image,
  Modal,
  Skeleton,
  Title,
} from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'
import dayjsLocale from 'dayjs/locale/tr'
dayjs.locale(dayjsLocale)

import { IoInformationCircle } from 'react-icons/io5'
import { useDisclosure } from '@mantine/hooks'
import { CreditCardForm } from '@/components/payment/credit-card'
import { CardValidationSchemaTypes } from '@/libs/credit-card-utils'

export const HotelBookingSummary = () => {
  const [searchParams] = useQueryStates(operationResultParams)
  const [
    paymentModalOpened,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false)

  const bookingDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response =
        await serviceRequest<OperationResultWithBookingCodeResponse>({
          axiosOptions: {
            url: 'api/product/handleOperationResultWithBookingCode',
            params: searchParams,
          },
        })
      return response
    },
  })

  const partialPaymentMutation = useMutation({
    mutationKey: ['partial-payment-mutation'],
    mutationFn: async (data: CardValidationSchemaTypes) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/payment/partialPayment',
          method: 'post',
          data: {
            ...data,

            SessionToken: dataViewResponsers[0].summaryResponse.sessionToken,
            SearchToken: dataViewResponsers[0].summaryResponse.searchToken,
            ProductKey: dataViewResponsers[0].summaryResponse.productKey,
          },
        },
      })

      return response
    },
  })

  if (!bookingDetailsDataQuery.data && bookingDetailsDataQuery.isLoading)
    return (
      <Container py={30} display={'grid'} className='gap-3' maw={700}>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </Container>
    )

  if (!bookingDetailsDataQuery.data || !bookingDetailsDataQuery.data.success)
    return (
      <Container py={'lg'} maw={600}>
        <Alert color='red'>Sonuç bulunamadı</Alert>
      </Container>
    )

  const dataViewResponsers = bookingDetailsDataQuery.data?.data
    ?.operationResultWithBookingCode?.productDataViewResponser
    .dataViewResponsers as HotelBookingDetailApiResponse
  const productDataViewResponser =
    dataViewResponsers[1]?.operationResultViewData
  const summaryViewDataResponserForHotel = dataViewResponsers[0]
  const insuranceFee =
    summaryViewDataResponserForHotel.summaryResponse.roomGroup
      .cancelWarrantyPrice.value ?? 0

  const hotelDataSummaryData = dataViewResponsers[0].summaryResponse
  const roomGroup = hotelDataSummaryData.roomGroup
  const isHotelPartialPayment =
    bookingDetailsDataQuery?.data?.data?.hotelCancelWarrantyPriceStatus
      ?.couponActive

  return (
    <>
      <Container
        maw={700}
        py={{
          base: 'md',
          md: 'xl',
        }}
        className='grid gap-3 md:gap-5'
      >
        {isHotelPartialPayment && (
          <div>
            <Alert
              variant='light'
              color='red'
              title='Ön Ödeme Bilgilendirmesi'
              icon={<IoInformationCircle />}
            >
              Rezervasyonunuzun %25 olan:{' '}
              <strong>
                {formatCurrency(
                  productDataViewResponser?.paymentInformation?.basketTotal -
                    productDataViewResponser.paymentInformation
                      .basketDiscountTotal -
                    insuranceFee
                )}
              </strong>{' '}
              ve güvence paketi olan {formatCurrency(insuranceFee)} tahsil
              edilmiştir. Kalan{' '}
              <strong>
                {formatCurrency(
                  productDataViewResponser.paymentInformation
                    .basketDiscountTotal
                )}
              </strong>{' '}
              lik tutarı, otele giriş gününüze 4 gün kalaya (
              {dayjs(
                summaryViewDataResponserForHotel.summaryResponse.roomGroup
                  .checkInDate
              )
                .subtract(4, 'days')
                .format('DD MMMM YYYY')}
              ) kadar, rezervasyonlarım sayfasına giderek tamamlayabilirsiniz.
              Kampanya veya fiyat değişikliği olması halinde kalan tutar sabit
              kalacak ve değişmeyecektir. Kalan tutarı taksitli ödemek
              isterseniz, ödeme yaptığınız günkü taksitli ödeme koşulları baz
              alınacaktır.
            </Alert>
          </div>
        )}
        <div className='grid gap-6 rounded-md border p-3 md:grid-cols-3 md:p-5'>
          <div className='col-span-1'>
            <Image
              src={roomGroup.hotel.images?.at(0)?.original}
              fallbackSrc={'/default-room.jpg'}
              alt=''
              radius={'md'}
            />
          </div>
          <div className='col-span-2'>
            <div>
              <Title fz={'h3'}>{roomGroup.hotel.name}</Title>
              <div>
                {roomGroup.hotel.address
                  ? roomGroup.hotel.address
                  : roomGroup.hotel.destination}
              </div>
            </div>
            <div className='pt-4'>
              <div className='flex gap-1'>
                <div className='font-semibold'>Giriş:</div> 
                <div>
                  {dayjs(roomGroup.checkInDate).format('DD MMMM dddd YYYY')}
                </div>
              </div>
              <div className='flex gap-1'>
                <div className='font-semibold'>Çıkış:</div> 
                <div>
                  {dayjs(roomGroup.checkOutDate).format('DD MMMM dddd YYYY')}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='grid gap-6 rounded-md border p-3 md:p-5'>
          {roomGroup.rooms.map((room, roomIndex) => {
            const roomDetail = roomGroup.roomDetails[roomGroup.hotelKey]

            const passengerPrice = roomGroup.passengerPrices[roomIndex]
            const adultCount = passengerPrice.passengers.reduce((a, b) => {
              if (b.passengerType === 0) return a + 1
              return 0
            }, 0)
            const childCount = passengerPrice.passengers.reduce((a, b) => {
              if (b.passengerType === 1) return a + 1
              return 0
            }, 0)
            const roomInfo = [
              `${adultCount} Yetişkin`,
              childCount > 0 ? `${childCount} Çocuk` : null,
              roomDetail.description,
              roomDetail.bedType,
              roomDetail.roomType,
            ]

            return (
              <div key={roomIndex} className='grid gap-3'>
                <Title order={3} fz={'h4'} className='border-b pb-2'>
                  {roomIndex + 1}. Oda Bilgileri
                </Title>
                <div
                  className='text-sm'
                  dangerouslySetInnerHTML={{
                    __html: roomInfo.filter(Boolean).toLocaleString(),
                  }}
                />
                {/* <div>
                İptal Politikası:{' '}
                <b className='text-green-800'>İptal Edilebilir</b>
              </div> */}

                {roomGroup.cancellationPolicies.length > 0 && (
                  <div className='grid gap-3'>
                    {roomGroup.cancellationPolicies.map(
                      (cancelPolicy, cancelPolicyIndex) => {
                        return (
                          <div key={cancelPolicyIndex}>
                            <Alert>{cancelPolicy.description}</Alert>
                          </div>
                        )
                      }
                    )}
                  </div>
                )}

                {roomGroup.cancellationPolicy && (
                  <div>
                    <Alert color='green'> {roomGroup.cancellationPolicy}</Alert>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className='grid gap-6 rounded-md border p-3 md:p-5'>
          <div className='max-w-lg'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <strong>Toplam</strong>
              </div>
              <div>
                {formatCurrency(
                  productDataViewResponser.paymentInformation.basketTotal
                )}
              </div>

              {!isHotelPartialPayment &&
                productDataViewResponser.paymentInformation
                  .basketDiscountTotal > 0 && (
                  <>
                    <div>
                      <strong>İndirim Çeki Tutarı</strong>
                    </div>
                    <div>
                      {formatCurrency(
                        productDataViewResponser.paymentInformation
                          .basketDiscountTotal
                      )}
                    </div>
                  </>
                )}
              {productDataViewResponser.paymentInformation.mlTotal &&
                productDataViewResponser.paymentInformation.mlTotal > 0 && (
                  <>
                    <div>
                      <strong>ParafPara TL</strong>
                    </div>
                    <div>
                      {formatCurrency(
                        productDataViewResponser.paymentInformation.mlTotal
                      )}
                    </div>
                  </>
                )}

              {isHotelPartialPayment && (
                <>
                  <div>
                    <strong>Toplam Tahsil Edilen</strong>
                  </div>
                  <div>
                    {formatCurrency(
                      productDataViewResponser.paymentInformation.basketTotal -
                        productDataViewResponser.paymentInformation
                          .basketDiscountTotal
                    )}
                  </div>
                  <div>
                    <strong>Son Ödeme Tarihi</strong>
                  </div>
                  <div>
                    {dayjs(roomGroup.checkInDate)
                      .subtract(4, 'days')
                      .format('DD MMMM YYYY')}
                  </div>
                  <div>
                    <strong>Ödenecek Tutar</strong>
                  </div>
                  <div>
                    {formatCurrency(
                      productDataViewResponser.paymentInformation
                        .basketDiscountTotal
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {isHotelPartialPayment && (
            <div>
              <Button type='button' onClick={openPaymentModal}>
                Ödeme Yap
              </Button>
            </div>
          )}
        </div>
      </Container>
      {isHotelPartialPayment && (
        <Modal
          opened={paymentModalOpened}
          onClose={closePaymentModal}
          size={772}
          title='Ödeme Bilgileri'
          closeOnEscape={false}
        >
          <CreditCardForm
            onFormSubmit={(data) => {
              partialPaymentMutation.mutate(data)
            }}
            isFormPending={partialPaymentMutation.isPending}
          />
        </Modal>
      )}
    </>
  )
}
