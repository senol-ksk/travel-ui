'use client'

import 'intl-tel-input/styles'

import {
  Button,
  Container,
  Input,
  TextInput,
  PasswordInput,
  Checkbox,
  Title,
  Grid,
  Anchor,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import IntlTelInput from 'intl-tel-input/react'
import clsx from 'clsx'
import { useMutation } from '@tanstack/react-query'
import { modals } from '@mantine/modals'

import { Image } from '@mantine/core'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'

import { registerSchema, RegisterSchemaTypes } from '@/app/auth/register/schema'
import { registerActions } from '@/app/auth/register/actions'

export const RegisterForm = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  })

  const handleMutate = useMutation({
    mutationFn: async (data: RegisterSchemaTypes) => {
      const actionResponse = await registerActions(
        data,
        window.location.origin + '/'
      )

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

  return (
    <Container className='mt-5 grid gap-5 rounded-lg border p-0 shadow md:grid-cols-4'>
      <div className='col-span-2 hidden rounded-l-lg border-r bg-blue-50 p-3 shadow md:grid'>
        <div className='flex flex-col gap-5 py-7'>
          <Link href='/'>
            <Image
              src='/logo.png'
              className='w-[40%] md:w-[25%]'
              alt='Paraflytravel'
            />
          </Link>
          <Grid gutter='xl'>
            <Grid.Col>
              <div className='flex items-center gap-2 font-bold'>
                Hemen Üye Ol,  Seyahatini Planlamaya Başla!{' '}
              </div>
            </Grid.Col>
            <Grid.Col>
              <div className='flex items-start gap-4'>
                <IoMdCheckmarkCircleOutline
                  size={26}
                  className='flex-shrink-0'
                />
                <div className='grid'>
                  <span className='font-bold'>
                    Yolcu bilgilerinizi kaydedin
                  </span>
                  <span>
                    Kendinize ve sevdiklerinize ait bilgileri kaydedin, bilet ve
                    rezervasyon işlemlerinizi çok daha hızlı halledin.
                  </span>
                </div>
              </div>
            </Grid.Col>

            <Grid.Col>
              <div className='flex items-start gap-4'>
                <IoMdCheckmarkCircleOutline
                  size={26}
                  className='flex-shrink-0'
                />
                <div className='flex flex-col'>
                  <span className='font-bold'>
                    Rezervasyonlarını kolayca yönet{' '}
                  </span>
                  <span>
                    Rezervasyonlarınıza ve bilet bilgilerinize dilediğiniz zaman
                    ulaşın.
                  </span>
                </div>
              </div>
            </Grid.Col>

            <Grid.Col>
              <div className='flex items-start gap-4'>
                <IoMdCheckmarkCircleOutline
                  size={26}
                  className='flex-shrink-0'
                />
                <div className='flex flex-col'>
                  <span className='font-bold'>ParafPara sorgulama yapın </span>
                  <span>
                    Kredi kartı puanlarınızı hesabınıza aktarın, biriken
                    puanlarla uçak ya da otobüs biletinizi alın, otel
                    rezervasyonunuzu yapın.
                  </span>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </div>
      <form
        className='col-span-1 p-3 py-7 md:col-span-2'
        onSubmit={form.handleSubmit((data) => {
          handleMutate.mutate(data)
        })}
      >
        <Title className='text-start text-xl'>Parafly Travel’a Üye Ol</Title>

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
              size='md'
              radius={'md'}
              type='submit'
              loading={handleMutate.isPending}
            >
              Üye Ol
            </Button>
          </div>
        </div>
        <div className='pt-5 text-center'>
          Zaten bir hesabınız mı var?{' '}
          <Anchor component={Link} href={'/auth/login'} fw={'bold'}>
            Giriş Yapın
          </Anchor>
        </div>
      </form>
    </Container>
  )
}
