'use client'

import dayjs from 'dayjs'
import cookies from 'js-cookie'
import { useForm, Controller } from 'react-hook-form'
import { Button, LoadingOverlay, NativeSelect, TextInput } from '@mantine/core'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cardValidation from 'card-validator'
import { formatCreditCard } from 'cleave-zen'

import { formatCurrency, yearList } from '@/libs/util'
import { range } from '@mantine/hooks'
import { useCheckoutQuery } from '@/app/reservation/checkout-query'
import { useMutation } from '@tanstack/react-query'
import { request } from '@/network'
import { PaymentResponeType, ResponseStatus } from '@/app/reservation/types'
import { use, useEffect, useRef } from 'react'

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

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ id: string }>

const PaymentPage = (props: { params: Params; searchParams: SearchParams }) => {
  const searchParams = use(props.searchParams)
  const formMethods = useForm<CardValidationSchemaTypes>({
    resolver: zodResolver(paymentValidationSchema),
  })
  const checkoutQuery = useCheckoutQuery(searchParams.id)
  const threeDformRef = useRef<HTMLFormElement>(null)

  const paymentMutation = useMutation({
    mutationKey: ['payment-mutation'],
    mutationFn: async (data: CardValidationSchemaTypes) => {
      const threedCallbackURL = `${window.location.origin}/reservation/callback/api`

      const paymentResponse = (await request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/api/payment/initProcess`,
        method: 'post',
        withCredentials: true,
        data: {
          ...data,
          billingInfo: checkoutQuery.data?.data?.paymentIndexModel.billingInfo,
          threeDCallbackUrl: threedCallbackURL,
          threeDSuccessURL: threedCallbackURL,
          threeDFailureURL: `${window.location.origin}/reservation/error/api`,
          searchToken: cookies.get('searchToken'),
          sessionToken: cookies.get('sessionToken'),
        },
      })) as PaymentResponeType

      return paymentResponse
    },
  })

  useEffect(() => {
    if (threeDformRef.current && paymentMutation.data?.success) {
      threeDformRef.current?.submit()
    }
  }, [paymentMutation.data])

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
              defaultValue={''}
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
        action={paymentMutation?.data?.data.action}
        method='POST'
        hidden
      >
        {paymentMutation.data && paymentMutation.data.success
          ? Object.keys(paymentMutation.data?.data).map((input, index) => {
              const value = input as keyof PaymentResponeType['data']

              return value !== 'action' ? (
                <input
                  key={index}
                  name={input}
                  defaultValue={paymentMutation.data.data[value]}
                  // readOnly
                  // disabled
                />
              ) : null
            })
          : null}
        {/* <button>submit</button> */}
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
