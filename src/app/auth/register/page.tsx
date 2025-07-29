'use client'
import 'intl-tel-input/styles'

import {
  Button,
  Container,
  Input,
  TextInput,
  PasswordInput,
  Checkbox,
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'

import { phoneSchema } from '@/libs/util'
import { serviceRequest } from '@/network'
import { z } from '@/libs/zod'

const registerSchema = z.object({
  name: z.string().nonempty().min(3),
  surname: z.string().nonempty(),
  email: z.string().email(),
  phone: phoneSchema,
  password: z.string().max(15).min(6),
  passwordRepeat: z.string().max(15).min(6),
  confirmAgreement: z.literal(true),
  confirmKVKK: z.literal(true),
})

type RegisterSchemaTypes = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  })

  const submitHandler = async (data: RegisterSchemaTypes) => {
    const response = await serviceRequest<{
      name: string
      returnUrl: null
      searchToken: null
      sessionToken: null
      userAuthenticationToken: string
    }>({
      axiosOptions: {
        url: 'api/account/register',
        method: 'post',
        data: {
          ...data,
          siteURL: window.location.origin,
        },
      },
    })

    if (response?.success) {
      console.log('basarili islem')
    } else {
      console.error('hatali islem')
    }
  }

  return (
    <Container
      size={600}
      py={{
        base: 'md',
        md: 'xl',
      }}
    >
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data)
          submitHandler(data)
        })}
      >
        <div className='grid grid-cols-2 gap-3 md:gap-5'>
          <div>
            <TextInput
              {...form.register('name')}
              label='Ad'
              error={form.formState.errors.name?.message}
              autoComplete='given-name'
            />
          </div>
          <div>
            <TextInput
              {...form.register('surname')}
              label='Soyad'
              error={form.formState.errors.surname?.message}
              autoComplete='family-name'
            />
          </div>
          <div className='col-span-2'>
            <TextInput
              size='md'
              label='E-posta'
              type='email'
              {...form.register('email')}
              error={form.formState.errors.email?.message}
              autoComplete='off'
            />
          </div>
          <div className='col-span-2'>
            <Input.Wrapper>
              <Input.Label>Cep Telefonu</Input.Label>
              <div
                className='m_6c018570 mantine-Input-wrapper'
                data-variant='default'
              >
                <Controller
                  control={form.control}
                  name='phone'
                  render={({ field, fieldState }) => {
                    return (
                      <IntlTelInput
                        {...field}
                        usePreciseValidation
                        inputProps={{
                          className: clsx(
                            'm_8fb7ebe7 mantine-Input-input py-4',
                            {
                              'border-rose-500': !!fieldState.error?.message,
                            }
                          ),
                          'data-variant': 'default',
                          id: field.name,
                          name: field.name,
                          type: 'tel',
                          autoComplete: 'phone',
                        }}
                        ref={(ref) => field.ref(ref?.getInput())}
                        onChangeNumber={field.onChange}
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
              {form.formState.errors.phone?.message && (
                <Input.Error className='pt-1'>
                  {form.formState.errors.phone?.message}
                </Input.Error>
              )}
            </Input.Wrapper>
          </div>
          <div>
            <PasswordInput
              {...form.register('password')}
              label='Şifre'
              error={form.formState.errors.password?.message}
            />
          </div>
          <div>
            <PasswordInput
              {...form.register('passwordRepeat')}
              label='Şifre Tekrar'
              error={form.formState.errors.password?.message}
            />
          </div>
          <div className='col-span-2'>
            <Checkbox
              label='Uçuş bilgilendirmeleri, fırsat ve kampanyalardan Rıza Metni kapsamında haberdar olmak istiyorum.'
              {...form.register('confirmAgreement')}
              error={form.formState.errors.confirmAgreement?.message}
            />
          </div>
          <div className='col-span-2'>
            <Checkbox
              label='Oturum açarak Şartlar ve Koşullar ile Gizlilik Politikasını okuduğumu ve kabul ettiğimi onaylıyorum.'
              {...form.register('confirmKVKK')}
              error={form.formState.errors.confirmKVKK?.message}
            />
          </div>
          <div className='col-span-2'>
            <Button
              fullWidth
              type='submit'
              //  disabled={!form.formState.isValid}
            >
              Üye Ol
            </Button>
          </div>
        </div>
      </form>
    </Container>
  )
}
