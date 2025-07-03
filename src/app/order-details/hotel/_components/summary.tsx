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
  Text,
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
import {
  PaymentValidationSchemaTypes,
  paymentValidationSchema,
} from '@/libs/credit-card-utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InstallmentApiResponse } from '@/types/global'
import { InstallmentSelect } from '@/app/reservation/(index)/payment/instalment-table'
import { useMemo } from 'react'

export const HotelBookingSummary = () => {
  const form = useForm({
    resolver: zodResolver(paymentValidationSchema),
  })
  const [searchParams] = useQueryStates(operationResultParams)
  const [
    paymentModalOpened,
    { open: openPaymentModal, close: closePaymentModal },
  ] = useDisclosure(false)

  const bookingDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<HotelBookingDetailApiResponse>
      >({
        axiosOptions: {
          url: 'api/product/handleOperationResultWithBookingCode',
          params: searchParams,
        },
      })
      return response
    },
  })

  const bookingDetailData = useMemo(
    () => bookingDetailsDataQuery.data?.data,
    [bookingDetailsDataQuery.data?.data]
  )
  const dataViewResponsers =
    bookingDetailData?.operationResultWithBookingCode.productDataViewResponser
      .dataViewResponsers
  const summaryResponse = dataViewResponsers?.[0].summaryResponse
  const searchToken = summaryResponse?.searchToken
  const sessionToken = summaryResponse?.sessionToken

  const productKey =
    bookingDetailData?.operationResultWithBookingCode.productDataViewResponser
      .dataViewResponsers[0].summaryResponse.productKey

  const partialPaymentMutation = useMutation({
    mutationKey: ['partial-payment-mutation'],
    mutationFn: async (data: PaymentValidationSchemaTypes) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/payment/partialPayment',
          method: 'post',
          data: {
            ...data,
            SessionToken: sessionToken,
            SearchToken: searchToken,
            ProductKey: productKey,
          },
        },
      })

      return response
    },
  })
  const cardNumber = form.watch('cardNumber')?.trim().replaceAll(' ', '')

  const installmentListQuery = useQuery({
    queryKey: ['installment-list', sessionToken, searchToken, productKey],
    enabled: paymentModalOpened,
    queryFn: async () => {
      const response = await serviceRequest<InstallmentApiResponse>({
        axiosOptions: {
          url: 'api/payment/partialPaymentInstallmentList',
          params: {
            sessionToken: sessionToken,
            searchToken: searchToken,
            productKey: productKey,
          },
        },
      })

      return response
    },
  })

  const installmentList =
    cardNumber && cardNumber.length > 5
      ? installmentListQuery?.data?.data?.installment.installmentInfoList.filter(
          (item) => item.binList.includes(cardNumber?.substring(0, 6) ?? 0)
        )
      : null

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
  // const dataViewResponsers =
  //   bookingDetailData?.operationResultWithBookingCode?.productDataViewResponser
  //     .dataViewResponsers

  const productDataViewResponser =
    dataViewResponsers?.[1].operationResultViewData
  const summaryViewDataResponserForHotel = summaryResponse
  const insuranceFee = summaryResponse?.roomGroup.cancelWarrantyPrice.value ?? 0

  const hotelDataSummaryData = dataViewResponsers?.[0].summaryResponse
  const roomGroup = hotelDataSummaryData?.roomGroup
  const isHotelPartialPayment =
    bookingDetailsDataQuery?.data?.data?.hotelCancelWarrantyPriceStatus
      ?.couponActive
  if (
    !productDataViewResponser ||
    !roomGroup ||
    !summaryViewDataResponserForHotel
  )
    return <div>no data</div>
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
              {dayjs(summaryResponse?.roomGroup.checkInDate)
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
          classNames={{
            body: 'p-6 md:p-8',
          }}
        >
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log(data)
              partialPaymentMutation.mutate({
                ...data,
              })
            })}
          >
            <div className='grid gap-5'>
              <CreditCardForm form={form} />
              <Text fz={'xs'} mb={0} className='text-gray-600'>
                Taksit seçenekleri için kartınızın ilk 6 hanesini giriniz
              </Text>
              {installmentList && installmentList.length > 0 && (
                <InstallmentSelect
                  onChange={(value) => {
                    form.setValue('installment', value)
                  }}
                  data={installmentList}
                />
              )}
            </div>
            <div className='flex flex-col items-center justify-center gap-3 sm:pt-8'>
              <div className='leading-md text-center text-sm sm:px-8'>
                Ödemeyi tamamla butonuna tıkladığımda{' '}
                <span className='text-blue-800'>
                  Mesafeli Satış Sözleşmesini
                </span>
                 ve <span className='text-blue-800'>Gizlilik Sözleşmesini</span>
                 okuduğumu ve kabul ettiğimi onaylıyorum.
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <div className='text-sm'>Ödenecek Tutar:</div>
                <div className='text-xl font-bold'>
                  {formatCurrency(
                    productDataViewResponser.paymentInformation
                      .basketDiscountTotal
                  )}
                </div>
              </div>
              <div className='max-w-full min-w-xs'>
                <Button fullWidth type='submit'>
                  Ödemeyi Tamamla
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
