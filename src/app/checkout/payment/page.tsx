'use client'

import dayjs from 'dayjs'

import { useForm, Controller } from 'react-hook-form'

import { Button, NativeSelect, TextInput } from '@mantine/core'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import cardValidation from 'card-validator'
import { formatCreditCard } from 'cleave-zen'

import { formatCurrency, yearList } from '@/libs/util'
import { range } from '@mantine/hooks'

let cardCvvLength = 3
const paymentValidationSchema = z.object({
  CardOwner: z.string().min(3).max(50),
  CardNumber: z
    .string()
    .optional()
    .refine((value) => {
      cardCvvLength = cardValidation.number(value).card?.code.size || 3

      return cardValidation.number(value).isValid
    }, 'Gecersiz Kart Numarası'),
  CardExpiredMonth: z.string(),
  CardExpiredYear: z.string(),
  CardCvv: z.string().refine((val) => {
    return val.length === cardCvvLength
  }),
})

const cardExpiredYearList = () =>
  yearList(dayjs().get('year'), dayjs().get('year') + 10).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

export type CardValidationSchemaTypes = z.infer<typeof paymentValidationSchema>

const cardMonths = () =>
  range(1, 31).map((month) => {
    return {
      label: '' + (month < 10 ? `0${month}` : month),
      value: '' + (month < 10 ? `0${month}` : month),
    }
  })

const PaymentPage = () => {
  const formMethods = useForm<CardValidationSchemaTypes>({
    resolver: zodResolver(paymentValidationSchema),
  })

  return (
    <form
      onSubmit={formMethods.handleSubmit((data) => {
        console.log('Data submitted:', data)
      })}
    >
      <CheckoutCard>
        <div className='grid w-full gap-3 md:w-72'>
          <Controller
            control={formMethods.control}
            name='CardOwner'
            defaultValue={''}
            render={({ field }) => {
              return (
                <TextInput
                  {...field}
                  autoComplete='cc-name'
                  label='Kart Üzerindeki İsim'
                  placeholder='Kart Üzerindeki İsim'
                  error={
                    !!formMethods.formState.errors.CardOwner
                      ? formMethods.formState.errors.CardOwner.message
                      : null
                  }
                />
              )
            }}
          />
          <Controller
            control={formMethods.control}
            name='CardNumber'
            defaultValue=''
            render={({ field }) => (
              <TextInput
                {...field}
                autoComplete='cc-number'
                label='Kart Numarası'
                type='tel'
                error={
                  !!formMethods.formState.errors.CardNumber
                    ? formMethods.formState.errors.CardNumber.message
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
              name='CardExpiredMonth'
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  label='Ay'
                  autoComplete='cc-exp-month'
                  data={[{ label: 'Ay', value: '' }, ...cardMonths()]}
                  error={
                    !!formMethods.formState.errors.CardExpiredMonth
                      ? formMethods.formState.errors.CardExpiredMonth.message
                      : null
                  }
                />
              )}
            />
            <Controller
              control={formMethods.control}
              name='CardExpiredYear'
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  autoComplete='cc-exp-year'
                  label='Yıl'
                  data={[{ label: 'Yıl', value: '' }, ...cardExpiredYearList()]}
                  error={
                    !!formMethods.formState.errors.CardExpiredYear
                      ? formMethods.formState.errors.CardExpiredYear.message
                      : null
                  }
                />
              )}
            />

            <Controller
              control={formMethods.control}
              name='CardCvv'
              defaultValue=''
              render={({ field }) => (
                <TextInput
                  {...field}
                  maxLength={
                    cardValidation.number(formMethods.watch('CardNumber')).card
                      ?.code.size || 3
                  }
                  label='CVV'
                  placeholder='CVV'
                  error={
                    !!formMethods.formState.errors.CardCvv
                      ? formMethods.formState.errors.CardCvv.message
                      : null
                  }
                />
              )}
            />
          </div>
        </div>
      </CheckoutCard>
      <Button type='submit'>Ödeme Yap</Button>
    </form>
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
