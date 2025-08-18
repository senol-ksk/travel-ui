'use client'

import { notifications } from '@mantine/notifications'
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
import { InstallmentSelect } from '@/app/reservation/(index)/_components/instalment-table'
import { useEffect, useMemo, useRef } from 'react'
import { PartialPaymentResponseType } from '@/app/reservation/types'

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

  const summaryResponse = bookingDetailData?.summaryResponse.summaryResponse
  const searchToken = summaryResponse?.searchToken
  const sessionToken = summaryResponse?.sessionToken

  const productKey = summaryResponse?.productKey

  const threeDFormRef = useRef<HTMLFormElement>(null)
  const partialPaymentMutation = useMutation({
    mutationKey: ['partial-payment-mutation'],
    mutationFn: async (data: PaymentValidationSchemaTypes) => {
      const threedCallbackURL = `${window.location.origin}/reservation/callback/api`
      const errorUrl = `${window.location.origin}/reservation/error/api`
      // const errorUrlSerializer = createSerializer(operationResultParams)
      // const errorUrl = errorUrlSerializer(
      //   `${window.location.origin}/online-operations/order-details/hotel`,
      //   {
      //     ...searchParams,
      //     partialPaymentError: 'Ödeme Hatası',
      //   }
      // )

      const response = await serviceRequest<PartialPaymentResponseType>({
        axiosOptions: {
          url: 'api/payment/partialPayment',
          method: 'post',
          data: {
            ...data,

            threeDCallbackUrl: threedCallbackURL,
            threeDSuccessURL: threedCallbackURL,
            threeDFailureURL: errorUrl,
            sessionToken,
            searchToken,
            productKey,
          },
        },
      })

      return response
    },
    onError: () => {
      notifications.show({
        title: 'Bir hata oluştu.',
        message:
          'Sistemsel bir hata oluştu. Lütfen daha sonra tekrara deneyin.',
        color: 'red',
        position: 'top-center',
        classNames: {
          root: 'bg-red-500',
          description: 'text-white',
          title: 'text-white',
          closeButton: 'text-white',
        },
      })
    },
    onSuccess: async (query) => {
      if (!query?.success) {
        notifications.show({
          title: 'Bir hata oluştu.',
          message: 'Kart bilgilerinizi gözden geçirin.',
          color: 'red',
          position: 'top-center',
          classNames: {
            root: 'bg-red-500',
            description: 'text-white',
            title: 'text-white',
            closeButton: 'text-white',
          },
        })
      }
    },
  })

  useEffect(() => {
    if (
      partialPaymentMutation.isSuccess &&
      partialPaymentMutation.data?.success &&
      partialPaymentMutation.data.data
    ) {
      threeDFormRef.current?.submit()
    }
  }, [
    partialPaymentMutation?.data?.data,
    partialPaymentMutation.data?.success,
    partialPaymentMutation.isSuccess,
  ])

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
      <div className='grid gap-3 md:gap-5'>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </div>
    )

  if (!bookingDetailsDataQuery.data || !bookingDetailsDataQuery.data.success)
    return <Alert color='red'>Sonuç bulunamadı</Alert>

  const productDataViewResponser =
    bookingDetailData?.operationViewData.operationResultViewData
  const summaryViewDataResponserForHotel = summaryResponse
  const insuranceFee = summaryResponse?.roomGroup.cancelWarrantyPrice.value ?? 0

  const hotelDataSummaryData = summaryResponse
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
      <div className='grid gap-3 md:gap-5'>
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
      </div>
      {isHotelPartialPayment && (
        <>
          <Modal
            opened={paymentModalOpened}
            onClose={closePaymentModal}
            size={772}
            title='Ödeme Bilgileri'
            closeOnEscape={false}
            classNames={{
              body: 'p-6 md:p-8',
            }}
            closeOnClickOutside={false}
          >
            <form
              onSubmit={form.handleSubmit((data) => {
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
                      form.setValue('installment', +value)
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
                   ve{' '}
                  <span className='text-blue-800'>Gizlilik Sözleşmesini</span>
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
                  <Button
                    fullWidth
                    type='submit'
                    loading={partialPaymentMutation.isPending}
                    disabled={!form.formState.isValid}
                  >
                    Ödemeyi Tamamla
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
          {isHotelPartialPayment && (
            <form
              ref={threeDFormRef}
              action={partialPaymentMutation.data?.data?.action}
              method='POST'
              hidden
            >
              {partialPaymentMutation.data?.data?.action &&
              partialPaymentMutation.isSuccess
                ? Object.keys(partialPaymentMutation.data?.data).map(
                    (input, index) => {
                      const keyValue = input as keyof PartialPaymentResponseType
                      const value =
                        partialPaymentMutation?.data?.data?.[keyValue]

                      return keyValue !== 'action' ? (
                        <input
                          key={index}
                          name={input}
                          value={value}
                          readOnly
                        />
                      ) : null
                    }
                  )
                : null}
            </form>
          )}
        </>
      )}
    </>
  )
}
