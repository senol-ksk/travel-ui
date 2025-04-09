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
import { useAirlineListQuery } from '@/libs/useAirlineListQuery'
import { phoneSchema } from '@/libs/util'

import { CountryOptions } from '@/app/reservation/components/countries'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

const schema = z.object({
  type: z.enum(['0', '1', '2']),
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
  // listFlightFrequencyAirline: z.array(z.string()).optional(),
  // listFlightFrequencyNo: z.array(z.string()).optional(),
})

export type FormSchemaType = z.infer<typeof schema>

type IProps = {
  onSubmit?: (data: FormSchemaType) => void
  isSubmitting?: boolean
}

const PassengerForm: React.FC<IProps> = ({
  onSubmit = () => null,
  isSubmitting = false,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  // const airlineList = useAirlineListQuery()

  // const airlineDropdownOptions = airlineList.data?.data
  //   ? airlineList?.data?.data?.map((airline) => ({
  //       label: airline.value.at(0)?.value ?? '',
  //       value: airline.code,
  //     }))
  //   : []

  console.log(form.formState.errors)

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        onSubmit(data)
      })}
    >
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5'>
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
            <Input.Label htmlFor='mobilPhoneNumber'>GSM No</Input.Label>
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
                        className: clsx('m_8fb7ebe7 mantine-Input-input', {
                          'border-rose-500': !!fieldState.error?.message,
                        }),
                        'data-variant': 'default',
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
        {/* <div className='col-span-2'>
          <Title order={4}>Havayolu Bilgileri</Title>
        </div>
        <div>
          {form?.formState?.defaultValues?.listFlightFrequencyAirline &&
          form?.formState?.defaultValues?.listFlightFrequencyAirline?.length >
            0 ? (
            form.formState?.defaultValues?.listFlightFrequencyAirline.map(
              (listFlightFrequencyAirline) => {
                console.log(listFlightFrequencyAirline)
                return (
                  <Controller
                    key={listFlightFrequencyAirline}
                    control={form.control}
                    name='listFlightFrequencyAirline'
                    // defaultValue={listFlightFrequencyAirline}
                    render={({ field, fieldState }) => (
                      <NativeSelect
                        label='Havayolu'
                        disabled={airlineList.isLoading}
                        data={[
                          { label: 'Lütfen bir havayolu seçin', value: '' },
                          ...airlineDropdownOptions,
                        ]}
                        {...field}
                      />
                    )}
                  />
                )
              }
            )
          ) : (
            <Controller
              control={form.control}
              name='listFlightFrequencyAirline'
              render={({ field, fieldState }) => (
                <NativeSelect
                  label='Havayolu'
                  disabled={airlineList.isLoading}
                  data={[
                    { label: 'Lütfen bir havayolu seçin', value: '' },
                    ...airlineDropdownOptions,
                  ]}
                  {...field}
                />
              )}
            />
          )}
        </div>
        <div>
          <TextInput label='Üyelik No' />
        </div> */}
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
