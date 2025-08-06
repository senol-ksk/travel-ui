'use client'

import 'intl-tel-input/styles'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Dialog,
  Input,
  NativeSelect,
  NumberInput,
  Radio,
  Switch,
  TextInput,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'

import { validTCKN } from '@/libs/tckn-validate'

import { CountryOptions } from '@/app/reservation/components/countries'
import { serviceRequest } from '@/network'
import { useMutation } from '@tanstack/react-query'
import { Account } from '../type'
import { useState } from 'react'

const schema = z.object({
  birthdate: z.string(),
  confirmAgreement: z.boolean(),
  confirmKVKK: z.boolean(),
  currentKVKKFileName: z.string().nullable().default(''),
  totalRewardAmount: z.number().nullable().default(0),
  email: z.string().email(),
  gender: z.number().refine((val) => val === 0 || val === 1, {
    message: 'Lütfen cinsiyet seçiniz',
  }),
  id: z.union([z.string(), z.number()]),
  identityNumber: z
    .union([z.string(), z.number(), z.null()])
    .refine((value) => value === null || validTCKN(String(value)), {
      message: 'Geçerli bir TCKN girin.',
    }),
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
  passportNumber: z.string().nullable().default(''),
  passportValidity: z.string().nullable().default(''),
  surname: z.string().min(3).max(30),
})

export type FormSchemaType = z.infer<typeof schema>

type IProps = {
  defaultValues: Account
}

const MyAccount: React.FC<IProps> = ({ defaultValues }) => {
  function handleSubmit(data: FormSchemaType) {
    submitMutation.mutate(data)
    console.log(data)
    console.log('Gönderilen data:', data.email)
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
        setDialogopened(true)
      }
    },
  })
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const [dialogOpened, setDialogopened] = useState(false)
  const [INotTc, SetINotTc] = useState(false)
  const notTcSwitch = () => {
    SetINotTc(!INotTc)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                label='TC Kimlik'
                error={fieldState.error?.message}
                {...field}
                value={field.value ?? undefined}
                disabled={INotTc}
              />
            )}
          />

          <Switch
            className='mt-3'
            onChange={notTcSwitch}
            checked={INotTc}
            label='TC Vatandaşı Değilim'
          />
        </div>

        <>
          <div className='col-span-2'></div>
          <div>
            <NativeSelect size='md' label='Pasaportu Veren Ülke'>
              <CountryOptions />
            </NativeSelect>
          </div>
          <div>
            <Controller
              control={form.control}
              name='passportNumber'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  value={field.value ?? undefined}
                  label='Pasaport No'
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name='passportValidity'
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
        </>

        <div className='col-span-2 m-0 p-0'></div>
        <div className='col-span-1'>
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
                      'data-variant': 'default',
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
                        fetch('https://ipapi.co/json')
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
      {/* <div className='grid gap-2 py-5'>
        <div>
          <Checkbox
            defaultChecked
            label='E-Posta ve SMS kampanyalarından Rıza Metni kapsamında haberdar olmak istiyorum.'
          />
        </div>
        <div>
          <Checkbox
            defaultChecked
            label='Kişisel Verilerin Korunması ve Gizlilik Politikasını okudum.'
          />
        </div>
      </div>
      <div className='col-span-2 my-4'>
        <Title order={3}>Sosyal hesaplar</Title>
      </div>
      <div className='flex items-center justify-between border-t py-3'>
        <div>
          <div>Facebook</div>
          <div>{form.formState.defaultValues?.email}</div>
        </div>
        <div>
          <NavLink
            label='Bağlan'
            component={Link}
            href={'/account/'}
            className='text-blue-800'
          />
        </div>
      </div>
      <div className='flex items-center justify-between border-t py-3'>
        <div>
          <div>Google</div>
          <div>{form.formState.defaultValues?.email}</div>
        </div>
        <div>
          <NavLink
            label='Bağlan'
            component={Link}
            href={'/account/'}
            className='text-blue-800'
          />
        </div>
      </div>
      <div className='flex items-center justify-between border-b pt-8 pb-2'>
        <Title order={3} className=''>
          Güvenlik
        </Title>
      </div>
      <div className='flex items-center justify-between py-5'>
        <div className='flex items-center gap-2'>
          <MdLockOutline size={24} />
          <div>Şifre işlemleri</div>
        </div>
        <div>
          <NavLink
            label='Şifremi değiştir'
            component={Link}
            href={'/account/'}
            className='text-blue-800'
          />
        </div>
      </div>
      <div className='flex items-center justify-between border-t border-b py-5 pb-15'>
        <div>
          <div className='flex items-center gap-2'>
            <LuMail size={24} />
            <div>E-posta işlemleri</div>
          </div>
        </div>
        <div>
          {' '}
          <NavLink
            label='E-posta adresimi değiştir'
            component={Link}
            href={'/account/'}
            className='text-blue-800'
          />
        </div>
      </div>*/}
      <div className='my-15 flex justify-between border-t py-5'>
        <div className='text-sm text-gray-600'>
          Lütfen bilgilerinizi doğru girdiğinizden emin olunuz. <br />
          Aksi Durumda yurt dışına çıkışınız mümkün olmayacaktır{' '}
        </div>
        <Button type='submit' size='md' loading={form.formState.isSubmitting}>
          Değişiklikleri kaydet
        </Button>
      </div>

      <Dialog
        position={{ top: 20, right: 20 }}
        opened={dialogOpened}
        withCloseButton
        onClose={() => setDialogopened(false)}
        size='lg'
        radius='md'
        className='rounded-md border bg-green-800 font-bold text-white'
      >
        Bilgileriniz Başarıyla Güncellenmiştir. <br /> Lütfen sayfayı
        yenileyiniz
      </Dialog>
    </form>
  )
}
export { MyAccount }
