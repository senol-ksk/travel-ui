'use client'

import 'intl-tel-input/styles'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  NumberInput,
  Radio,
  Switch,
  TextInput,
  Title,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'
import { z } from '@/libs/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'
import { validTCKN } from '@/libs/tckn-validate'
import { serviceRequest } from '@/network'
import { useMutation } from '@tanstack/react-query'
import { Account } from '../type'
import { notifications } from '@mantine/notifications'
import { MdOutlineMailOutline } from 'react-icons/md'
import { Link } from 'next-view-transitions'

const schema = z
  .object({
    birthdate: z.string(),
    confirmAgreement: z.boolean(),
    confirmKVKK: z.boolean(),
    currentKVKKFileName: z.string().nullable(),
    email: z.string().email(),
    gender: z.number().refine((val) => val === 0 || val === 1),
    id: z.string().or(z.number()),
    identityNumber: z.string().optional(),
    isFacebookConnected: z.boolean(),
    isForeign: z.boolean(),
    isGoogleConnected: z.boolean(),
    isInEmailPromoList: z.boolean(),
    isInSmsPromoList: z.boolean(),
    isMobileConnectActivated: z.boolean(),
    isPhoneNumberConfirmed: z.boolean(),
    loginProvider: z.literal('site'),
    mobilePhone: z.string(),
    mobilePhoneNumberFull: z.string(),
    name: z.string().min(3).max(20),
    passportNumber: z.string().default(''),
    passportValidity: z.string().nullable(),
    surname: z.string().min(3).max(30),
    totalRewardAmount: z.number().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.isForeign && !validTCKN(value.identityNumber!)) {
      return ctx.addIssue({
        code: 'custom',
        path: ['identityNumber'],
        message: 'Gecerli tc giriniz',
      })
    }
  })

export type FormSchemaType = z.infer<typeof schema>

type IProps = {
  defaultValues: Account
}

const MyAccount: React.FC<IProps> = ({ defaultValues }) => {
  function handleSubmit(data: FormSchemaType) {
    submitMutation.mutate(data)
  }

  const submitMutation = useMutation({
    mutationFn: async (data: FormSchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/update-user-info',
          method: 'POST',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        notifications.show({
          title: 'Kullanıcı bilgileriniz güncellendi',
          message: <div>Bilgileriniz Başarıyla Güncellenmiştir.</div>,
          position: 'top-right',
          color: 'green',
          classNames: {
            root: 'bg-green-50',
          },
        })
      }
    },
    onError: () => {
      notifications.show({
        title: 'Hata',
        message: 'lütfen tekrar deneyiniz',
        color: 'red',
        position: 'top-right',
        classNames: {
          root: 'bg-red-50',
        },
      })
    },
  })
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-15'>
      <div className='flex flex-col gap-5 md:grid md:grid-cols-2'>
        <div className='col-span-2 my-5'>
          <Controller
            control={form.control}
            name='gender'
            render={({ field, fieldState }) => (
              <Radio.Group
                value={String(field.value ?? '')}
                onChange={(val) => field.onChange(Number(val))}
                error={fieldState.error?.message}
              >
                <div className='flex items-center gap-5'>
                  <Radio value='0' label='Erkek' />
                  <Radio value='1' label='Kadın' />
                </div>
              </Radio.Group>
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='name'
            render={({ field, fieldState }) => (
              <TextInput
                label='Ad'
                withAsterisk
                error={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='surname'
            render={({ field, fieldState }) => (
              <TextInput
                withAsterisk
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
            name='identityNumber'
            render={({ field, fieldState }) => (
              <NumberInput
                withAsterisk
                hideControls
                inputMode='numeric'
                label='TC Kimlik'
                error={fieldState.error?.message}
                disabled={form.watch('isForeign')}
                {...field}
                onChange={(value) => field.onChange('' + value)}
              />
            )}
          />

          <Controller
            control={form.control}
            name='isForeign'
            render={({ field }) => {
              return (
                <Switch
                  defaultChecked={field.value}
                  className='mt-3'
                  label='TC Vatandaşı Değilim'
                  name={field.name}
                  onChange={({ currentTarget: { checked } }) => {
                    if (checked) {
                      form.setValue('identityNumber', '', {
                        shouldValidate: false,
                      })
                    }
                    field.onChange(checked)
                  }}
                />
              )
            }}
          />
        </div>

        <div>
          <Controller
            control={form.control}
            name='passportNumber'
            defaultValue={form.formState.defaultValues?.passportNumber}
            render={({ field, fieldState }) => (
              <TextInput
                label='Pasaport No'
                error={fieldState.error?.message}
                {...field}
                value={'' + field.value}
                onChange={({ currentTarget: { value } }) =>
                  field.onChange(value)
                }
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={form.control}
            name='passportValidity'
            defaultValue={form.formState.defaultValues?.passportValidity}
            render={({ field, fieldState }) => (
              <DatePickerInput
                size='md'
                label='Pasaport Geçerlilik Tarihi'
                error={fieldState.error?.message}
                valueFormat='DD MMMM YYYY'
                {...field}
              />
            )}
          />
        </div>
        <div className='col-span-1'>
          <Controller
            control={form.control}
            name='email'
            disabled
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
            <Input.Label htmlFor='mobilePhone' className='font-normal'>
              GSM No
            </Input.Label>
            <div
              className='m_6c018570 mantine-Input-wrapper'
              data-variant='default'
            >
              <Controller
                control={form.control}
                name='mobilePhone'
                render={({ field, fieldState }) => (
                  <IntlTelInput
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
                    initialValue={form.formState.defaultValues?.mobilePhone}
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
                        fetch('https://ipapi.co/json', {
                          credentials: 'include',
                        })
                          .then((res) => res.json())
                          .then((data) => callback(data.country_code))
                          .catch(() => callback('tr'))
                      },
                    }}
                  />
                )}
              />
            </div>
          </Input.Wrapper>
        </div>
      </div>
      <div>
        <Title order={3} className='border-b'>
          Güvenlik
        </Title>
        <div className='flex items-center justify-between pb-10 md:py-4'>
          <div className='flex items-center gap-2'>
            <MdOutlineMailOutline size={20} />
            E-posta İşlemleri
          </div>
          <Link href='/account/change-mail'>
            <div className='cursor-pointer text-blue-800 underline'>
              E-posta Değiştir
            </div>
          </Link>{' '}
        </div>
        <div className='flex items-center justify-between gap-5 md:border-t md:py-5'>
          <div className='hidden text-sm text-gray-600 md:flex'>
            Lütfen bilgilerinizi doğru girdiğinizden emin olunuz. <br />
            Aksi Durumda yurt dışına çıkışınız mümkün olmayacaktır{' '}
          </div>

          <Button
            type='submit'
            size='md'
            loading={submitMutation.isPending}
            className='w-full md:w-auto'
          >
            Değişiklikleri kaydet
          </Button>
        </div>
      </div>
    </form>
  )
}
export { MyAccount }
