'use client'
import 'intl-tel-input/styles'

import {
  Button,
  Container,
  Input,
  TextInput,
  PasswordInput,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { modals } from '@mantine/modals'

import { registerSchema, RegisterSchemaTypes } from './schema'
import { registerActions } from './actions'

export default function RegisterPage() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  })

  const handleMutate = useMutation({
    mutationFn: async (data: RegisterSchemaTypes) => {
      const actionResponse = await registerActions(
        data,
        window.location.origin + '/'
      )

      console.log(actionResponse)

      return actionResponse
    },
    onSuccess(query, variables) {
      if (!query?.data) {
        modals.open({
          title: 'Bir Sorun Var',
          children: (
            <div>
              <div>
                Girdiğiniz bilgilerle daha önce bir üyelik açılmış olabilir.
                Bilgilerinizi kontrol edin.
              </div>
              <div className='pt-4 text-center'>
                <Button
                  component={Link}
                  href={'/auth/login'}
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Veya Giriş Yapın
                </Button>
              </div>
            </div>
          ),
        })
      }

      if (query?.success) {
        modals.open({
          title: 'İşlem Başarılı',
          closeOnClickOutside: false,
          withCloseButton: false,
          children: (
            <div>
              <div>
                Kayıt işleminiz başarılı. Epostanıza gelen aktivasyon
                bağlantısını tıklayarak üyeliğinizi aktif edebilirsiniz.
              </div>
              <div className='pt-4 text-center'>
                <Button
                  component={Link}
                  href={'/auth/login'}
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Giriş Yap
                </Button>
              </div>
            </div>
          ),
          closeOnEscape: false,
        })
      }
    },
  })

  const handleSubmit = (data: RegisterSchemaTypes) => {
    handleMutate.mutate(data)
  }

  return (
    <Container
      pos={'relative'}
      size={600}
      py={{
        base: 'md',
        md: 'xl',
      }}
    >
      <LoadingOverlay
        visible={handleMutate.isPending}
        overlayProps={{
          radius: 'md',
          blur: 2,
        }}
      />
      <form onSubmit={form.handleSubmit(handleSubmit)} className='relative'>
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
              error={form.formState.errors.passwordRepeat?.message}
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
              // disabled={!form.formState.isValid}
              loading={handleMutate.isPending}
            >
              Üye Ol
            </Button>
          </div>
        </div>
      </form>
    </Container>
  )
}
