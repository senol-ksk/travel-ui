import cardValidation from 'card-validator'
import { yearList } from '@/libs/util'
import { Button, Input, NativeSelect, TextInput } from '@mantine/core'
import { range } from '@mantine/hooks'
import { formatCreditCard } from 'cleave-zen'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  paymentValidationSchema,
  CardValidationSchemaTypes,
} from '@/libs/credit-card-utils'

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
  onFormSubmit: (data: CardValidationSchemaTypes) => void
  isFormPending: boolean
}

export const CreditCardForm: React.FC<IProps> = ({
  onFormSubmit,
  isFormPending = false,
}) => {
  const form = useForm({
    resolver: zodResolver(paymentValidationSchema),
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log(data)
        onFormSubmit(data)
      })}
    >
      <div>
        <TextInput
          withAsterisk
          label='Kart üzerindeki isim'
          autoComplete='cc-name'
          defaultValue=''
          placeholder='Kart Üzerindeki İsim'
          {...form.register('cardOwner')}
          error={form.formState.errors.cardOwner?.message}
        />
      </div>
      <div>
        <Controller
          control={form.control}
          name='cardNumber'
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextInput
              withAsterisk
              label='Kart Numarası'
              type='tel'
              autoComplete='cc-number'
              {...field}
              error={fieldState.error?.message}
              onChange={({ currentTarget: { value } }) => {
                const formattedValue = formatCreditCard(value).trim()
                field.onChange(formattedValue)
              }}
            />
          )}
        />
      </div>
      <div>
        <Input.Label htmlFor='cardExpiredMonth'>
          Son kullanma tarihi
        </Input.Label>
        <NativeSelect
          {...form.register('cardExpiredMonth')}
          id='cardExpiredMonth'
          data={[{ label: 'Ay', value: '' }, ...cardMonths()]}
          error={form.formState.errors.cardExpiredMonth?.message}
        />
        <NativeSelect
          {...form.register('cardExpiredYear')}
          error={form.formState.errors.cardExpiredYear?.message}
          data={[{ label: 'Yıl', value: '' }, ...cardExpiredYearList()]}
        />
      </div>
      <div>
        <TextInput
          label='CVV'
          {...form.register('cardCvv')}
          error={form.formState.errors.cardCvv?.message}
          maxLength={
            cardValidation.number(form.watch('cardNumber')).card?.code.size || 3
          }
        />
      </div>
      <Button type='submit' loading={isFormPending}>
        Ödemeyi Tamamla
      </Button>
    </form>
  )
}
