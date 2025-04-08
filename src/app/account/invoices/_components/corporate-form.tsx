import { Button, NativeSelect, Textarea, TextInput, Input } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'

import { CountryOptions } from '@/app/reservation/components/countries'
import { phoneSchema } from '@/libs/util'
import { SavedInvoicesResponse } from '../types'

const schema = z.object({
  vergiNo: z.string().min(3),
  vergiDairesi: z.string().min(3),
  phoneNumber: phoneSchema,
  // hesAddress: null,
  // faxNumber: null,
  // tcKimlikNo: z.string().refine((value) => validTCKN(value)),
  name: z.string().optional().default('none'),
  lastName: z.string().optional().default('none'),
  title: z.string(),
  type: z.number().default(1),
  countryCode: z.string(),
  city: z.string().min(3).max(49),
  district: z.string().min(3).max(49),
  address: z.string().min(3).max(255),
  // mobilPhoneNumber: phoneSchema,
  billingInfoName: z.string().min(3).max(49),
  email: z.string().email(),
  id: z.string().or(z.number()).optional(),
})
export type CorporateFormSchemaType = z.infer<typeof schema>
type IProps = {
  onFormSubmit: (data: CorporateFormSchemaType) => void
  defaultValues?: SavedInvoicesResponse
  isSubmitting?: boolean
}

const CorporateForm: React.FC<IProps> = ({
  onFormSubmit,
  defaultValues,
  isSubmitting = false,
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address: defaultValues?.address,
      billingInfoName: defaultValues?.billingInfoName,
      city: defaultValues?.city,
      countryCode: defaultValues?.countryCode,
      district: defaultValues?.district,
      email: defaultValues?.email,
      phoneNumber: defaultValues?.phoneNumber,
      title: defaultValues?.title,
      type: defaultValues?.type,
      vergiDairesi: defaultValues?.vergiDairesi ?? '',
      vergiNo: defaultValues?.vergiNo ?? '',
      id: defaultValues?.id,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)}>
      <div className='grid gap-3 py-4 md:grid-cols-2'>
        <Controller
          control={form.control}
          defaultValue=''
          name='billingInfoName'
          render={({ field, fieldState }) => (
            <TextInput
              label='Faturaya bir ad verin'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <div />

        <Controller
          defaultValue=''
          control={form.control}
          name='title'
          render={({ field, fieldState }) => (
            <TextInput
              label='Şirket Ünvanı'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          defaultValue=''
          control={form.control}
          name='vergiDairesi'
          render={({ field, fieldState }) => (
            <TextInput
              label='Vergi Dairesi'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          defaultValue=''
          name='vergiNo'
          render={({ field, fieldState }) => (
            <TextInput
              label='Vergi Numarası'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name='countryCode'
          defaultValue='TR'
          render={({ field }) => (
            <NativeSelect label='Ülke' {...field}>
              <CountryOptions />
            </NativeSelect>
          )}
        />
        <Controller
          control={form.control}
          name='city'
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextInput
              label='Şehir'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name='district'
          defaultValue=''
          render={({ field, fieldState }) => (
            <TextInput
              label='İlçe'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <div className='md:col-span-2'>
          <Controller
            control={form.control}
            name='address'
            defaultValue=''
            render={({ field, fieldState }) => (
              <Textarea
                label='Adres'
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
        <Controller
          control={form.control}
          defaultValue=''
          name='email'
          render={({ field, fieldState }) => (
            <TextInput
              label='E-Posta'
              type='email'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />
        <Input.Wrapper>
          <Input.Label htmlFor='mobilPhoneNumber'>GSM No</Input.Label>
          <div
            className='m_6c018570 mantine-Input-wrapper'
            data-variant='default'
          >
            <Controller
              control={form.control}
              name='phoneNumber'
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
                    initialValue={form.formState.defaultValues?.phoneNumber}
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
      <div className='flex justify-center'>
        <Button type='submit' loading={isSubmitting}>
          Kaydet
        </Button>
      </div>
    </form>
  )
}

export { CorporateForm }
