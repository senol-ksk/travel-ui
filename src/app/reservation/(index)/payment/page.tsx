'use client'

import { useEffect, useRef } from 'react'
import dayjs from 'dayjs'

import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  LoadingOverlay,
  NativeSelect,
  Skeleton,
  Stack,
  TextInput,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { range } from '@mantine/hooks'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cardValidation from 'card-validator'
import { formatCreditCard } from 'cleave-zen'

import { formatCurrency, yearList } from '@/libs/util'
import { useCheckoutQuery } from '@/app/reservation/checkout-query'
import { serviceRequest, ServiceResponse } from '@/network'
import { PaymentResponeType } from '@/app/reservation/types'
import { createSerializer, useQueryStates } from 'nuqs'
import { reservationParsers } from '../../searchParams'

let cardCvvLength = 3
const paymentValidationSchema = z.object({
  moduleName: z.string(),
  reservable: z.number(),
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
  const formMethods = useForm<CardValidationSchemaTypes>({
    resolver: zodResolver(paymentValidationSchema),
  })
  const [queryStrings] = useQueryStates(reservationParsers)

  const checkoutQuery = useCheckoutQuery()
  const threeDformRef = useRef<HTMLFormElement>(null)

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
          withCredentials: true,
          data: {
            ...data,
            cardNumber: data.cardNumber?.replaceAll(' ', ''),
            billingInfo:
              checkoutQuery.data?.data?.paymentIndexModel.billingInfo,
            threeDCallbackUrl: threedCallbackURL,
            threeDSuccessURL: threedCallbackURL,
            threeDFailureURL: `${window.location.origin}/reservation/error/api`,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
          },
        },
      })

      return paymentResponse?.data
    },
  })

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

  if (checkoutQuery.error || !checkoutQuery.data || !queryStrings.productKey)
    return <div>Hata olustu</div>

  return (
    <>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          console.log('Data submitted:', data)
          paymentMutation.mutate(data)
        })}
        className='relative grid gap-3 md:gap-5'
      >
        <LoadingOverlay visible={paymentMutation.isPending} />
        {checkoutQuery.data ? (
          <>
            <input
              {...formMethods.register('moduleName', {
                value: checkoutQuery.data?.data?.viewBag.ModuleName,
              })}
              type='hidden'
            />
            <input
              {...formMethods.register('reservable', {
                value: checkoutQuery.data?.data?.viewBag.Reservable,
              })}
              type='hidden'
            />
          </>
        ) : null}
        <CheckoutCard>
          <div className='grid w-full gap-3 md:w-72'>
            <Controller
              control={formMethods.control}
              name='cardOwner'
              defaultValue={`${
                checkoutQuery.data?.data?.treeContainer.childNodes[0].items[0]
                  .value.firstName
              } ${
                checkoutQuery.data?.data?.treeContainer.childNodes[0].items[0]
                  .value.lastName
              }`}
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
        </CheckoutCard>

        <CheckoutCard>
          <div className='flex justify-center'>
            {checkoutQuery.data?.data ? (
              <div className='flex gap-3'>
                <div>
                  <div className='text-sm'>Toplam Tutar</div>
                  <div className='pt-1 text-lg font-semibold'>
                    {formatCurrency(
                      checkoutQuery.data?.data.viewBag.SummaryViewDataResponser
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
        <input
          type='hidden'
          name='productKey'
          defaultValue={queryStrings?.productKey}
          readOnly
          hidden
        />
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
                  disabled
                />
              ) : null
            })
          : null}
      </form>
    </>
  )
}

const CheckoutCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <div className='grid gap-3 rounded-md border bg-white p-2 shadow-sm md:gap-6 md:p-6'>
    {children}
  </div>
)

export default PaymentPage
