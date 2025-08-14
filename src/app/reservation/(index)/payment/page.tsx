'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryStates } from 'nuqs'
import dayjs from 'dayjs'
import { notifications } from '@mantine/notifications'
import cardValidation from 'card-validator'

import NextImage from 'next/image'
import { GrAmex } from 'react-icons/gr'

import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  NativeSelect,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { range, upperFirst, useDisclosure } from '@mantine/hooks'
import clsx from 'clsx'
import { zodResolver } from '@hookform/resolvers/zod'

import { formatCreditCard } from 'cleave-zen'
import NumberFlow from '@number-flow/react'
import { RiCheckboxCircleFill, RiVisaLine } from 'react-icons/ri'

import { formatCurrency, yearList } from '@/libs/util'
import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import { serviceRequest } from '@/network'
import {
  ParafParaPaymentResponse,
  PaymentResponseType,
} from '@/app/reservation/types'
import { reservationParsers } from '@/app/reservation/searchParams'

import { InstallmentTableModal, InstallmentSelect } from './instalment-table'
import { CheckoutCard } from '@/components/card'
import threedImage from './threed-info.png'
import { MasterCardLogo, TroyCardLogo } from '@/components/logo/credit-cards'
import { Coupon } from '../../components/coupon'
import { useCouponQuery } from '../useCouponQuery'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { ParafParaView } from '../../components/paraf'

import paymentSegmentClasses from '@/styles/PaymentMethodSegment.module.css'
import {
  PaymentValidationSchemaTypes,
  paymentValidationSchema,
} from '@/libs/credit-card-utils'
import { BsFillCreditCardFill } from 'react-icons/bs'
import { MdCreditCard } from 'react-icons/md'
// import { CreditCardForm } from '@/components/payment/credit-card'

enum PaymentMethodEnums {
  CreditCard,
  Bonus,
}

const cardExpiredYearList = () =>
  yearList(dayjs().get('year'), dayjs().get('year') + 20).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

const cardMonths = () =>
  range(1, 12).map((month) => {
    return {
      label: '' + (month < 10 ? `0${month}` : month),
      value: '' + (month < 10 ? `0${month}` : month),
    }
  })

const PaymentPage = () => {
  const [
    isOpenInstallmentTable,
    { open: openInstallmentTableModal, close: closeInstallmentTableModal },
  ] = useDisclosure(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnums>(
    PaymentMethodEnums.CreditCard
  )

  const [paymentButtonSectionIsVisible, setPaymentButtonSectionIsVisible] =
    useState(true)

  const formMethods = useForm({
    resolver: zodResolver(paymentValidationSchema),
  })
  const [queryStrings] = useQueryStates(reservationParsers)

  const { checkoutDataQuery: checkoutQuery } = useCheckoutMethods()
  const threeDformRef = useRef<HTMLFormElement>(null)

  const checkoutQueryMemoData = useMemo(
    () => checkoutQuery.data?.data,
    [checkoutQuery.data?.data]
  )

  const moduleName = useMemo(
    () => checkoutQueryMemoData?.viewBag.ModuleName,
    [checkoutQueryMemoData?.viewBag.ModuleName]
  ) as ProductPassengerApiResponseModel['viewBag']['ModuleName']

  const paymentMutation = useMutation<
    PaymentResponseType | null | undefined,
    null,
    PaymentValidationSchemaTypes
  >({
    mutationKey: ['payment-mutation'],
    mutationFn: async (data) => {
      const threedCallbackURL = `${window.location.origin}/reservation/callback/api`

      const paymentResponse = await serviceRequest<PaymentResponseType>({
        axiosOptions: {
          url: `api/payment/initProcess`,
          method: 'post',
          data: {
            ...data,
            cardNumber: data.cardNumber?.replaceAll(' ', ''),
            billingInfo: checkoutQueryMemoData?.paymentIndexModel.billingInfo,
            threeDCallbackUrl: threedCallbackURL,
            threeDSuccessURL: threedCallbackURL,
            threeDFailureURL: `${window.location.origin}/reservation/error/api`,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
            reservable: checkoutQueryMemoData?.viewBag.Reservable ?? 0,
            installment: formMethods.getValues('installment'),
            useBonus: paymentMethod === PaymentMethodEnums.Bonus,
            moduleName,
          },
        },
      })

      return paymentResponse?.data
    },
  })
  const handlePrivilegedCardMutation = useMutation({
    mutationFn: async (data: PaymentValidationSchemaTypes) => {
      const paymentResponse = await serviceRequest<ParafParaPaymentResponse>({
        axiosOptions: {
          url: 'api/payment/privilegeCardHandler',
          method: 'post',
          data: {
            ...data,
            cardNumber: data.cardNumber?.replaceAll(' ', ''),
            billingInfo: checkoutQueryMemoData?.paymentIndexModel.billingInfo,
            threeDFailureURL: `${window.location.origin}/reservation/error/api`,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
            reservable: checkoutQueryMemoData?.viewBag.Reservable ?? 0,
            installment: formMethods.getValues('installment'),
            useBonus: true,
            moduleName,
          },
        },
      })

      return paymentResponse
      // return parafParaResponseDummyData
    },
    onSuccess(query) {
      if (!query?.success) {
        notifications.show({
          title: 'Sonuç Bulunamadı!',
          message: <div>Kart bilgilierinizi kontrol ediniz.</div>,
          withCloseButton: true,
          autoClose: 5000,
          position: 'top-center',
          color: 'red',
          classNames: {
            root: 'bg-red-200',
            description: 'text-black',
          },
        })
      }
      if (query?.success && query.data) {
        const cardNumber =
          formMethods.getValues('cardNumber')?.replaceAll(' ', '') ?? ''

        installmentTableSelectOptions.current = query.data
          ?.calculatedInstalmentList.installmentInfoList.length
          ? query.data.calculatedInstalmentList.installmentInfoList.filter(
              (item) => item.binList.includes(cardNumber.substring(0, 6))
            )
          : null

        setPaymentButtonSectionIsVisible(true)
        checkoutQuery.refetch()
      }
    },
  })

  const installmentTableSelectOptions = useRef<
    | {
        amountPerInstallment: number
        bankName: string
        binList: string
        cardProgramName: string
        installmentCount: number
        totalAmount: number
        interestRate: number | null | undefined
      }[]
    | undefined
  >(null)
  const { applyCouponMutation, revokeCouponMutation } = useCouponQuery()
  const cardNumber = formMethods.watch('cardNumber')
  const handleCardNumberChange = () => {
    const cardNumber = formMethods.getValues('cardNumber')?.replaceAll(' ', '')

    if (!cardNumber || cardNumber.length < 6 || !checkoutQueryMemoData) {
      installmentTableSelectOptions.current = null
      formMethods.setValue('installment', '1')
      return
    }

    installmentTableSelectOptions.current =
      checkoutQueryMemoData?.paymentIndexModel.installment.installmentInfoList.filter(
        (item) => item.binList.includes(cardNumber.substring(0, 6))
      )
  }

  useEffect(() => {
    if (paymentMutation.isSuccess && paymentMutation.data) {
      threeDformRef.current?.submit()
    }
  }, [paymentMutation.data, paymentMutation.isSuccess])

  const isCouponUsed = useMemo(
    () =>
      Array.isArray(
        checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
          .couponDiscountList
      ) &&
      checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
        .couponDiscountList.length > 0,
    [
      checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
        .couponDiscountList,
    ]
  )

  if (checkoutQuery.isLoading) {
    return (
      <Stack gap={12} className='max-w-[600px]'>
        <Skeleton height={20} radius='xl' />
        <Skeleton height={20} w={'80%'} radius='xl' />
        <Skeleton height={16} radius='xl' w={'75%'} />
        <Skeleton height={10} width='60%' radius='xl' />
      </Stack>
    )
  }

  const reservationData = checkoutQueryMemoData
  const passengerData = reservationData?.treeContainer
  const firstPassengerFullName = passengerData?.childNodes[0].items[0].value
    ? `${upperFirst(passengerData?.childNodes[0].items[0].value.firstName.toLocaleLowerCase())} ${upperFirst(passengerData?.childNodes[0].items[0].value.lastName.toLocaleLowerCase())}`
    : `${upperFirst(passengerData?.childNodes[0]?.childNodes?.at(0)?.items.at(0)?.value?.firstName?.toLowerCase() ?? '')} ${upperFirst(passengerData?.childNodes[0].childNodes.at(0)?.items.at(0)?.value.lastName.toLocaleLowerCase() ?? '')}`

  const handleCouponActions = async (promotionText?: string) => {
    if (promotionText && !isCouponUsed) {
      const applyResponse = await applyCouponMutation.mutateAsync({
        promotionText,
        moduleName,
      })

      if (applyResponse?.success) {
        handlePrivilegedCardMutation.reset()
        setPaymentMethod(PaymentMethodEnums.CreditCard)
        notifications.show({
          title: 'Tebrikler!',
          message: (
            <div>
              <span className='font-semibold underline'>
                {applyResponse?.data?.discountPrice.value
                  ? formatCurrency(applyResponse?.data?.discountPrice.value)
                  : null}
              </span>{' '}
              indirim uygulandı.
            </div>
          ),
          withCloseButton: true,
          autoClose: 5000,
          position: 'top-center',
          color: 'green',
          classNames: {
            root: 'bg-green-200',
            description: 'text-black',
          },
        })
      }
    }

    if (isCouponUsed) {
      const revokeResponse = await revokeCouponMutation.mutateAsync({
        moduleName,
      })

      if (revokeResponse?.success) {
        setPaymentMethod(PaymentMethodEnums.CreditCard)
        handlePrivilegedCardMutation.reset()
      }
    }

    checkoutQuery.refetch()
  }

  if (!reservationData || !queryStrings.productKey)
    return <div>Hata olustu</div>

  return (
    <>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          paymentMutation.mutate(data)
        })}
        className='relative grid gap-3 md:gap-5'
      >
        <LoadingOverlay
          visible={
            paymentMutation.isPending || handlePrivilegedCardMutation.isPending
          }
        />

        {!checkoutQueryMemoData.viewBag.HotelCancelWarrantyPriceStatusModel
          .hotelWarrantyDiscountSelected && (
          <CheckoutCard>
            <Coupon
              loading={
                revokeCouponMutation.isPending || applyCouponMutation.isPending
              }
              isCouponUsed={isCouponUsed}
              onRevoke={handleCouponActions}
              onCouponSubmit={handleCouponActions}
            />
          </CheckoutCard>
        )}

        <CheckoutCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MdCreditCard size={22} className='text-blue-800' />
            <span className='text-xl font-bold'>Ödeme Bilgileri</span>
          </div>
          <div className='flex flex-col gap-3 md:gap-5'>
            <div>
              <SegmentedControl
                withItemsBorders={false}
                classNames={paymentSegmentClasses}
                transitionDuration={400}
                data={[
                  {
                    label: (
                      <Center className='gap-2'>
                        <span
                          className={clsx('hidden md:block', {
                            'opacity-0':
                              paymentMethod === PaymentMethodEnums.Bonus,
                          })}
                        >
                          <RiCheckboxCircleFill size={22} />
                        </span>
                        <span className='md:text-md font-bold'>
                          Kredi Kartı İle Ödeme
                        </span>
                      </Center>
                    ),
                    value: '' + PaymentMethodEnums.CreditCard,
                  },
                  {
                    label: (
                      <Center className='gap-2'>
                        <span
                          className={clsx('hidden md:block', {
                            'opacity-0':
                              paymentMethod === PaymentMethodEnums.CreditCard,
                          })}
                        >
                          <RiCheckboxCircleFill size={22} />
                        </span>
                        <span className='md:text-md font-bold'>
                          ParafPara İle Ödeme
                        </span>
                      </Center>
                    ),
                    value: '' + PaymentMethodEnums.Bonus,
                  },
                ]}
                value={'' + paymentMethod}
                onChange={(value) => {
                  setPaymentMethod(+value)
                  setPaymentButtonSectionIsVisible(
                    +value === PaymentMethodEnums.CreditCard
                  )
                }}
              />
            </div>
            <div className='grid items-center gap-3 sm:grid-cols-2'>
              <div>
                {/* <CreditCardForm form={formMethods} /> */}

                <div className='grid w-full gap-3'>
                  <Controller
                    control={formMethods.control}
                    name='cardOwner'
                    defaultValue={firstPassengerFullName}
                    render={({ field }) => {
                      return (
                        <TextInput
                          className='grid gap-1'
                          {...field}
                          autoComplete='cc-name'
                          size='md'
                          label='Kart üzerindeki isim'
                          placeholder='Kart Üzerindeki İsim'
                          error={
                            !!formMethods.formState.errors.cardOwner
                              ? formMethods.formState.errors.cardOwner.message
                              : null
                          }
                        />
                      )
                    }}
                  />
                  <Controller
                    control={formMethods.control}
                    name='cardNumber'
                    defaultValue=''
                    render={({ field }) => (
                      <TextInput
                        className='grid gap-1'
                        {...field}
                        autoComplete='cc-number'
                        label='Kart Numarası'
                        type='tel'
                        size='md'
                        error={
                          !!formMethods.formState.errors.cardNumber
                            ? formMethods.formState.errors.cardNumber.message
                            : null
                        }
                        // value={creditCardNumber}
                        onChange={({ currentTarget: { value } }) => {
                          const formattedValue = formatCreditCard(value).trim()
                          field.onChange(formattedValue)
                          handleCardNumberChange()
                        }}
                      />
                    )}
                  />
                  <div className='grid grid-cols-3 items-center gap-3'>
                    <div className='col-span-2'>
                      <div className='grid gap-1'>
                        <div className='text-sm'>Son kullanma tarihi</div>
                        <div className='flex gap-3'>
                          <div className='w-full'>
                            <Controller
                              control={formMethods.control}
                              name='cardExpiredMonth'
                              render={({ field }) => (
                                <NativeSelect
                                  className='w-full'
                                  {...field}
                                  size='md'
                                  autoComplete='cc-exp-month'
                                  data={[
                                    { label: 'Ay', value: '' },
                                    ...cardMonths(),
                                  ]}
                                  error={
                                    !!formMethods.formState.errors
                                      .cardExpiredMonth
                                      ? formMethods.formState.errors
                                          .cardExpiredMonth.message
                                      : null
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className='w-full'>
                            <Controller
                              control={formMethods.control}
                              name='cardExpiredYear'
                              render={({ field }) => (
                                <NativeSelect
                                  className='w-full'
                                  {...field}
                                  size='md'
                                  autoComplete='cc-exp-year'
                                  data={[
                                    { label: 'Yıl', value: '' },
                                    ...cardExpiredYearList(),
                                  ]}
                                  error={
                                    !!formMethods.formState.errors
                                      .cardExpiredYear
                                      ? formMethods.formState.errors
                                          .cardExpiredYear.message
                                      : null
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-1'>
                      <Controller
                        control={formMethods.control}
                        name='cardCvv'
                        defaultValue=''
                        render={({ field }) => (
                          <TextInput
                            className='w-full'
                            {...field}
                            maxLength={
                              cardValidation.number(
                                formMethods.watch('cardNumber')
                              ).card?.code.size || 3
                            }
                            label='CVV'
                            placeholder='CVV'
                            size='md'
                            error={
                              !!formMethods.formState.errors.cardCvv
                                ? formMethods.formState.errors.cardCvv.message
                                : null
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className='pt-5'>
                  <Text fz={'xs'} mb={0} className='text-gray-600'>
                    Taksit seçenekleri için kartınızın ilk 6 hanesini giriniz
                  </Text>
                  <UnstyledButton
                    type='button'
                    onClick={openInstallmentTableModal}
                    className='text-xs text-blue-800'
                  >
                    Taksit Tablosu
                  </UnstyledButton>
                </div>
              </div>
              <div className='hidden ps-10 sm:block'>
                <div className='flex items-center gap-5'>
                  <div>
                    <NextImage
                      src={threedImage}
                      width={63}
                      height={29}
                      alt='3D Güvenli Ödeme Sistemi'
                    />
                  </div>
                  <div className='leading-none'>
                    <div className='text-xs text-gray-600'>
                      3D Güvenli Ödeme Sistemi
                    </div>
                    <strong>GÜVENLİ ALIŞVERİŞ</strong>
                  </div>
                </div>
                <div className='py-5 text-xs text-gray-600'>
                  Paraflytravel.com üzerinden yapılan işlemler, Google Trust
                  Services koruması altındadır.
                </div>
                <div>
                  <Group>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <RiVisaLine size={24} color='#1434CB' />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <MasterCardLogo size={20} />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <GrAmex size={24} color='#1174CB' />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <TroyCardLogo />
                    </div>
                  </Group>
                </div>
              </div>
            </div>
            {paymentMethod === PaymentMethodEnums.Bonus && (
              <div className='grid gap-3'>
                <div>
                  <Button
                    loading={handlePrivilegedCardMutation.isPending}
                    type='button'
                    onClick={async () => {
                      const formData = formMethods.getValues()
                      const isFormValid = await formMethods.trigger([
                        'cardCvv',
                        'cardExpiredMonth',
                        'cardExpiredYear',
                        'cardExpiredYear',
                        'cardNumber',
                        'cardOwner',
                      ])

                      if (isFormValid) {
                        handlePrivilegedCardMutation.mutate({
                          cardCvv: formData.cardCvv,
                          cardExpiredMonth: formData.cardExpiredMonth,
                          cardExpiredYear: formData.cardExpiredYear,
                          cardOwner: formData.cardOwner,
                          cardNumber: formData.cardNumber,
                          installment: '1',
                        })
                      }
                    }}
                  >
                    ParafPara Sorgula
                  </Button>
                </div>
                {handlePrivilegedCardMutation.data?.success &&
                  handlePrivilegedCardMutation.data?.data && (
                    <ParafParaView
                      data={handlePrivilegedCardMutation.data?.data}
                    />
                  )}
              </div>
            )}

            {checkoutQueryMemoData.paymentIndexModel &&
              checkoutQueryMemoData?.paymentIndexModel?.installment &&
              cardNumber && (
                <InstallmentSelect
                  data={
                    handlePrivilegedCardMutation.data?.data
                      ?.calculatedInstalmentList.installmentInfoList.length &&
                    paymentMethod === PaymentMethodEnums.Bonus
                      ? handlePrivilegedCardMutation.data?.data?.calculatedInstalmentList.installmentInfoList.filter(
                          (item) =>
                            item.binList.includes(
                              cardNumber
                                .trim()
                                .replaceAll(' ', '')
                                .substring(0, 6)
                            )
                        )
                      : checkoutQueryMemoData?.paymentIndexModel.installment.installmentInfoList.filter(
                          (item) =>
                            item.binList.includes(
                              cardNumber
                                .trim()
                                .replaceAll(' ', '')
                                .substring(0, 6)
                            )
                        )
                  }
                  onChange={(value) => {
                    // formMethods.setValue('')
                    formMethods.setValue('installment', value)
                  }}
                />
              )}
          </div>
        </CheckoutCard>

        {paymentButtonSectionIsVisible && (
          <CheckoutCard>
            <Text className='py-5 text-center md:px-10' fz={'sm'}>
              Ödemeyi tamamla butonuna tıkladığımda{' '}
              <span className='text-blue-800'>Mesafeli Satış Sözleşmesini</span>
               ve <span className='text-blue-800'>Gizlilik Sözleşmesini</span>
               okuduğumu ve kabul ettiğimi onaylıyorum.
            </Text>
            <div className='flex justify-center'>
              {checkoutQueryMemoData ? (
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='text-sm'>Ödenecek Tutar:</div>
                    <div className='text-xl font-semibold'>
                      <NumberFlow
                        format={{
                          style: 'currency',
                          currency: 'TRY',
                          currencyDisplay: 'narrowSymbol',
                        }}
                        value={
                          checkoutQueryMemoData.viewBag.SummaryViewDataResponser
                            .summaryResponse.totalPrice ?? 0
                        }
                      />
                    </div>
                  </div>
                  <Button
                    className='my-3'
                    size='lg'
                    radius='md'
                    type='submit'
                    //  disabled={isPrivilegeCardCheck}
                  >
                    Ödemeyi Tamamla
                  </Button>
                </div>
              ) : null}
            </div>
          </CheckoutCard>
        )}
      </form>

      <form
        ref={threeDformRef}
        action={paymentMutation.data?.action}
        method='POST'
        hidden
      >
        {paymentMutation.data && paymentMutation.isSuccess
          ? Object.keys(paymentMutation.data).map((input, index) => {
              const value = input as keyof PaymentResponseType

              return value !== 'action' ? (
                <input
                  key={index}
                  name={input}
                  defaultValue={
                    paymentMutation?.data ? paymentMutation?.data[value] : ''
                  }
                  readOnly
                />
              ) : null
            })
          : null}
      </form>
      {checkoutQueryMemoData?.paymentIndexModel.installment
        .installmentInfoList && (
        <Modal
          opened={isOpenInstallmentTable}
          onClose={closeInstallmentTableModal}
          title='Tüm Kartlara Göre Taksit Tablosu'
          size={'auto'}
        >
          <InstallmentTableModal
            data={
              checkoutQueryMemoData?.paymentIndexModel.installment
                .installmentInfoList
            }
          />
        </Modal>
      )}
    </>
  )
}

export default PaymentPage
