'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Group,
  Input,
  NativeSelect,
  NumberInput,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { range } from '@mantine/hooks'

import { validTCKN } from '@/libs/tckn-validate'
import { useAirlineListQuery } from '@/libs/useAirlineListQuery'
import { phoneSchema } from '@/libs/util'

import { CountryOptions } from '@/app/reservation/components/countries'

const schema = z.object({
  type: z.enum(['0', '1', '2']),
  title: z.enum(['0', '1', '2']),
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  birthdate: z.coerce.date(),
  gender: z.enum(['0', '1']),
  citizenNo: z
    .string()
    .or(z.number())
    .refine((value) => validTCKN('' + value)),
  nationality: z.string().default('tr'),
  passportCountry: z.string().nonempty(),
  passportNo: z.string().nonempty().max(11),
  passportValidityDate: z.coerce.date(),
  email: z.string().email(),
  mobilePhoneNumber: phoneSchema,
  listFlightFrequencyAirline: z.string().optional(),
  listFlightFrequencyNo: z.string().optional(),
})

const days = () =>
  range(1, 31).map((currentIndex) => {
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`

    return {
      label: '' + value,
      value: '' + value,
    }
  })

const PassengerForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const airlineList = useAirlineListQuery()

  const airlineDropdownOptions = airlineList.data?.data
    ? airlineList?.data?.data?.map((airline) => ({
        label: airline.value.at(0)?.value ?? '',
        value: airline.code,
      }))
    : []

  console.log(form.formState.errors)

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log(data)
      })}
    >
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5'>
        <div className='col-span-2 flex'>
          <Controller
            control={form.control}
            defaultValue={'0'}
            name='type'
            render={({ field, fieldState }) => (
              <NativeSelect
                label='Yolcu Tipi'
                data={[
                  { label: 'Yetişkin', value: '0' },
                  { label: 'Çocuk', value: '1' },
                  { label: 'Bebek', value: '2' },
                ]}
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='firstName'
            render={({ field, fieldState }) => (
              <TextInput
                label='Ad'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='lastName'
            render={({ field, fieldState }) => (
              <TextInput
                label='Soyad'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='birthdate'
            render={({ field, fieldState }) => (
              <DatePickerInput
                label='Doğum Tarihi'
                placeholder='Doğum Tarihi'
                error={fieldState.error?.message}
                valueFormat='DD MMMM YYYY'
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='gender'
            render={({ field, fieldState }) => (
              <NativeSelect
                label='Cinsiyet'
                data={[
                  { label: 'Cinsiyet seçin', value: '' },
                  { label: 'Erkek', value: '0' },
                  { label: 'Kadın', value: '1' },
                ]}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='citizenNo'
            defaultValue={form.formState.defaultValues?.citizenNo}
            render={({ field, fieldState }) => (
              <NumberInput
                hideControls
                label='TC Kimlik'
                inputMode='numeric'
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className='col-span-2'>
          <Title order={4}>Pasaport Bilgileri</Title>
        </div>
        <div>
          <Controller
            control={form.control}
            name='passportCountry'
            defaultValue={form.formState.defaultValues?.passportCountry}
            render={() => (
              <NativeSelect label='Pasaportu Veren Ülke'>
                <CountryOptions />
              </NativeSelect>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='passportNo'
            render={({ field, fieldState }) => (
              <TextInput
                label='Pasaport No'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='passportValidityDate'
            render={({ field, fieldState }) => (
              <DatePickerInput
                label='Pasaport Geçerlilik Tarihi'
                error={fieldState.error?.message}
                valueFormat='DD MMMM YYYY'
                {...field}
              />
            )}
          />
        </div>
        <div className='col-span-2'>
          <Title order={4}>İletişim Bilgileri</Title>
        </div>
        <div>
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <TextInput
                type='email'
                label='E-posta'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <TextInput type='tel' inputMode='numeric' label='GSM No' />
        </div>
        <div className='col-span-2'>
          <Title order={4}>Havayolu Bilgileri</Title>
        </div>
        <div>
          <NativeSelect
            label='Havayolu'
            disabled={airlineList.isLoading}
            data={[
              { label: 'Lütfen bir havayolu seçin', value: '' },
              ...airlineDropdownOptions,
            ]}
          />
        </div>
        <div>
          <TextInput label='Üyelik No' />
        </div>
      </div>
      <div className='flex justify-center pt-5'>
        <Button type='submit'>Kaydet</Button>
      </div>
    </form>
  )
}

export { PassengerForm }
