'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useQueryStates } from 'nuqs'
import dayjs from 'dayjs'

import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Skeleton,
  Stack,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { range, upperFirst, useDisclosure } from '@mantine/hooks'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cardValidation from 'card-validator'
import { formatCreditCard } from 'cleave-zen'

import { formatCurrency, yearList } from '@/libs/util'
import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import { serviceRequest } from '@/network'
import { PaymentResponeType } from '@/app/reservation/types'
import { reservationParsers } from '@/app/reservation/searchParams'

import { InstallmentTableModal, InstallmentSelect } from './instalment-table'
import { CheckoutCard } from '@/components/card'

let cardCvvLength = 3
const paymentValidationSchema = z.object({
  cardOwner: z.string().min(3).max(50),
  cardNumber: z
    .string()
    .optional()
    .refine((value) => {
      cardCvvLength = cardValidation.number(value).card?.code.size || 3

      return cardValidation.number(value).isValid
    }, 'Gecersiz Kart Numarası'),
  cardExpiredMonth: z.string(),
  cardExpiredYear: z.string(),
  cardCvv: z.string().refine((val) => {
    return val.length === cardCvvLength
  }),
  installment: z.string().default('1'),
})

const cardExpiredYearList = () =>
  yearList(dayjs().get('year'), dayjs().get('year') + 20).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

export type CardValidationSchemaTypes = z.infer<typeof paymentValidationSchema>

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
  )

  const paymentMutation = useMutation<
    PaymentResponeType | null | undefined,
    null,
    CardValidationSchemaTypes
  >({
    mutationKey: ['payment-mutation'],
    mutationFn: async (data) => {
      const threedCallbackURL = `${window.location.origin}/reservation/callback/api`

      const paymentResponse = await serviceRequest<PaymentResponeType>({
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
            moduleName,
          },
        },
      })

      return paymentResponse?.data
    },
  })
  const installmentTableSelectOptions = useRef<
    {
      amountPerInstallment: number
      bankName: string
      binList: string
      cardProgramName: string
      installmentCount: number
      totalAmount: number
    }[]
  >(null)
  const listenCardNumberChange = (data: string) => {
    if (!data || data.length < 6 || !checkoutQueryMemoData) {
      installmentTableSelectOptions.current = null
      formMethods.setValue('installment', '1')
      return
    }

    installmentTableSelectOptions.current =
      checkoutQueryMemoData?.paymentIndexModel.installment.installmentInfoList.filter(
        (item) => item.binList.includes(data.substring(0, 6))
      )
  }

  useEffect(() => {
    if (paymentMutation.isSuccess && paymentMutation.data) {
      threeDformRef.current?.submit()
    }
  }, [paymentMutation.data, paymentMutation.isSuccess])

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
        <LoadingOverlay visible={paymentMutation.isPending} />

        <CheckoutCard>
          <div className='grid w-full gap-3 md:w-72'>
            <Controller
              control={formMethods.control}
              name='cardOwner'
              defaultValue={firstPassengerFullName}
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    autoComplete='cc-name'
                    label='Kart Üzerindeki İsim'
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
                  {...field}
                  autoComplete='cc-number'
                  label='Kart Numarası'
                  type='tel'
                  error={
                    !!formMethods.formState.errors.cardNumber
                      ? formMethods.formState.errors.cardNumber.message
                      : null
                  }
                  // value={creditCardNumber}
                  onChange={({ currentTarget: { value } }) => {
                    const formatedValue = formatCreditCard(value).trim()
                    listenCardNumberChange(value.replaceAll(' ', ''))
                    field.onChange(formatedValue)
                  }}
                />
              )}
            />
            <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
              <Controller
                control={formMethods.control}
                name='cardExpiredMonth'
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    label='Ay'
                    autoComplete='cc-exp-month'
                    data={[{ label: 'Ay', value: '' }, ...cardMonths()]}
                    error={
                      !!formMethods.formState.errors.cardExpiredMonth
                        ? formMethods.formState.errors.cardExpiredMonth.message
                        : null
                    }
                  />
                )}
              />
              <Controller
                control={formMethods.control}
                name='cardExpiredYear'
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    autoComplete='cc-exp-year'
                    label='Yıl'
                    data={[
                      { label: 'Yıl', value: '' },
                      ...cardExpiredYearList(),
                    ]}
                    error={
                      !!formMethods.formState.errors.cardExpiredYear
                        ? formMethods.formState.errors.cardExpiredYear.message
                        : null
                    }
                  />
                )}
              />

              <Controller
                control={formMethods.control}
                name='cardCvv'
                defaultValue=''
                render={({ field }) => (
                  <TextInput
                    {...field}
                    maxLength={
                      cardValidation.number(formMethods.watch('cardNumber'))
                        .card?.code.size || 3
                    }
                    label='CVV'
                    placeholder='CVV'
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
          <div className='text-end'>
            <UnstyledButton
              type='button'
              onClick={openInstallmentTableModal}
              className='text-sm text-orange-600'
            >
              Kartlara Göre Taksit Tablosu
            </UnstyledButton>
          </div>
          {installmentTableSelectOptions.current &&
            installmentTableSelectOptions.current.length > 0 && (
              <div>
                <InstallmentSelect
                  data={installmentTableSelectOptions.current}
                  onChange={(value) => {
                    // formMethods.setValue('')
                    formMethods.setValue('installment', value)
                  }}
                />
              </div>
            )}
        </CheckoutCard>

        <CheckoutCard>
          <div className='flex justify-center'>
            {checkoutQueryMemoData ? (
              <div className='flex gap-3'>
                <div>
                  <div className='text-sm'>Toplam Tutar</div>
                  <div className='pt-1 text-lg font-semibold'>
                    {formatCurrency(
                      checkoutQueryMemoData.viewBag.SummaryViewDataResponser
                        .summaryResponse.totalPrice
                    )}
                  </div>
                </div>
                <Button
                  size='lg'
                  type='submit'
                  // disabled={!isSubmittable}
                >
                  Ödeme Yap
                </Button>
              </div>
            ) : null}
          </div>
        </CheckoutCard>
      </form>

      <form
        ref={threeDformRef}
        action={paymentMutation.data?.action}
        method='POST'
        hidden
      >
        {paymentMutation.data && paymentMutation.isSuccess
          ? Object.keys(paymentMutation.data).map((input, index) => {
              const value = input as keyof PaymentResponeType

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
