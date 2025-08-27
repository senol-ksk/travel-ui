'use client'

import 'intl-tel-input/styles'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  NativeSelect,
  NumberInput,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'

import { validTCKN } from '@/libs/tckn-validate'

import { phoneSchema } from '@/libs/util'

import { CountryOptions } from '@/app/reservation/components/countries'

const schema = z.object({
  type: z.string().nonempty(),
  firstName: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  birthdate: z.coerce.date(),
  gender: z.string().nonempty(),
  citizenNo: z
    .string()
    .or(z.number())
    .refine((value) => validTCKN('' + value)),
  nationality: z.string().default('tr'),
  passportCountry: z.string().optional(),
  passportNo: z.string().optional(),
  passportValidityDate: z.coerce.date(),
  email: z.string().email(),
  mobilePhoneNumber: phoneSchema,
})

export type FormSchemaType = z.infer<typeof schema>
import { type SavePassengerServiceResponse } from '../types'

type IProps = {
  onSubmit?: (data: FormSchemaType) => void
  isSubmitting?: boolean
  defaultValues?: SavePassengerServiceResponse
}

const PassengerForm: React.FC<IProps> = ({
  onSubmit = () => null,
  isSubmitting = false,
  defaultValues,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      birthdate: new Date(defaultValues?.birthDate ?? 0),
      citizenNo: defaultValues?.citizenNo,
      email: defaultValues?.email,
      firstName: defaultValues?.firstName,
      gender: defaultValues?.gender.toString(),
      lastName: defaultValues?.lastName,
      mobilePhoneNumber: defaultValues?.mobilePhoneNumber,
      nationality: defaultValues?.nationality,
      passportCountry: defaultValues?.passportCountry,
      passportNo: defaultValues?.passportNo ?? '',
      passportValidityDate: new Date(defaultValues?.passportValidityDate ?? 0),
      type: defaultValues?.type.toString() ?? '0',
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        onSubmit(data)
      })}
    >
      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-5'>
        <div className='col-span-2 flex'>
          <Controller
            control={form.control}
            defaultValue={form.formState.defaultValues?.type ?? '0'}
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
            defaultValue={form.formState.defaultValues?.firstName ?? ''}
            render={({ field, fieldState }) => (
              <TextInput
                label='Ad'
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='lastName'
            defaultValue={form.formState.defaultValues?.lastName ?? ''}
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
            defaultValue={form.formState.defaultValues?.birthdate}
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
            defaultValue={form.formState.defaultValues?.gender ?? '0'}
            render={({ field, fieldState }) => (
              <NativeSelect
                label='Cinsiyet'
                data={[
                  { label: 'Erkek', value: '0' },
                  { label: 'Kadın', value: '1' },
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
            defaultValue={form.formState.defaultValues?.passportCountry ?? 'TR'}
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
            defaultValue={form.formState.defaultValues?.passportNo ?? ''}
            render={({ field, fieldState }) => (
              <TextInput
                label='Pasaport No'
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='passportValidityDate'
            defaultValue={form.formState.defaultValues?.passportValidityDate}
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
            defaultValue={form.formState.defaultValues?.email ?? ''}
            render={({ field, fieldState }) => (
              <TextInput
                size='md'
                type='email'
                label='E-posta'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <div>
          <Input.Wrapper>
            <Input.Label htmlFor='mobilPhoneNumber' className='font-normal'>
              GSM No
            </Input.Label>
            <div
              className='m_6c018570 mantine-Input-wrapper'
              data-variant='default'
            >
              <Controller
                control={form.control}
                name='mobilePhoneNumber'
                defaultValue={form.formState.defaultValues?.mobilePhoneNumber}
                render={({ field, fieldState }) => {
                  return (
                    <IntlTelInput
                      {...field}
                      usePreciseValidation
                      inputProps={{
                        className: clsx('m_8fb7ebe7 mantine-Input-input py-5', {
                          'border-rose-500': !!fieldState.error?.message,
                        }),
                        id: field.name,
                        name: field.name,
                      }}
                      ref={(ref) => field.ref(ref?.getInput())}
                      onChangeNumber={field.onChange}
                      initialValue={
                        form.formState.defaultValues?.mobilePhoneNumber
                      }
                      initOptions={{
                        strictMode: true,
                        containerClass: 'w-full',
                        separateDialCode: true,
                        initialCountry: 'auto',
                        i18n: {
                          tr: 'Türkiye',
                          searchPlaceholder: 'Ülke adı giriniz',
                        },
                        loadUtils: () =>
                          // @ts-expect-error watch for the package updates
                          import('intl-tel-input/build/js/utils.js'),
                        geoIpLookup: (callback) => {
                          fetch('https://ipapi.co/json')
                            .then((res) => res.json())
                            .then((data) => callback(data.country_code))
                            .catch(() => callback('tr'))
                        },
                      }}
                    />
                  )
                }}
              />
            </div>
          </Input.Wrapper>
        </div>
      </div>
      <div className='flex justify-center pt-5'>
        <Button type='submit' loading={isSubmitting}>
          Kaydet
        </Button>
      </div>
    </form>
  )
}

export { PassengerForm }
