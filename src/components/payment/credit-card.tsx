import cardValidation from 'card-validator'
import { yearList } from '@/libs/util'
import { Input, NativeSelect, TextInput } from '@mantine/core'
import { range } from '@mantine/hooks'
import { formatCreditCard } from 'cleave-zen'
import dayjs from 'dayjs'
import { Controller, UseFormReturn } from 'react-hook-form'

import { CreditCardSchemaType } from '@/libs/credit-card-utils'

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

type IProps = {
  form: UseFormReturn<CreditCardSchemaType>
}

export const CreditCardForm: React.FC<IProps> = ({ form }) => {
  return (
    <div className='grid gap-3 md:grid-cols-3'>
      <div className='sm:col-span-3'>
        <TextInput
          label='Kart üzerindeki isim'
          autoComplete='cc-name'
          defaultValue=''
          placeholder='Kart Üzerindeki İsim'
          {...form.register('cardOwner')}
          error={form.formState.errors.cardOwner?.message}
          size='md'
        />
      </div>
      <div className='sm:col-span-3'>
        <Controller
          control={form.control}
          name='cardNumber'
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextInput
              label='Kart Numarası'
              type='tel'
              autoComplete='cc-number'
              {...field}
              error={fieldState.error?.message}
              onChange={({ currentTarget: { value } }) => {
                const formattedValue = formatCreditCard(value).trim()
                field.onChange(formattedValue)
              }}
              size='md'
            />
          )}
        />
      </div>
      <div className='sm:col-span-2'>
        <Input.Label htmlFor='cardExpiredMonth' size='md'>
          Son kullanma tarihi
        </Input.Label>
        <div className='grid w-full grid-cols-2 gap-2'>
          <div>
            <NativeSelect
              size='md'
              {...form.register('cardExpiredMonth')}
              id='cardExpiredMonth'
              data={[{ label: 'Ay', value: '' }, ...cardMonths()]}
              error={form.formState.errors.cardExpiredMonth?.message}
            />
          </div>
          <div>
            <NativeSelect
              size='md'
              {...form.register('cardExpiredYear')}
              error={form.formState.errors.cardExpiredYear?.message}
              data={[{ label: 'Yıl', value: '' }, ...cardExpiredYearList()]}
            />
          </div>
        </div>
      </div>
      <div className='sm:col-span-1'>
        <TextInput
          size='md'
          type='tel'
          inputMode='numeric'
          label='CVV'
          {...form.register('cardCvv')}
          error={form.formState.errors.cardCvv?.message}
          maxLength={
            cardValidation.number(form.watch('cardNumber')).card?.code.size || 3
          }
        />
      </div>
    </div>
  )
}
