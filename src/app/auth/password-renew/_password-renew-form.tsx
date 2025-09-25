'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, PasswordInput, Text, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { passwordRenewSchema, type PasswordRenewSchemaTypes } from './schema'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { modals } from '@mantine/modals'
import { Link } from 'next-view-transitions'
import { GoCheckCircleFill } from 'react-icons/go'
import { Route } from 'next'

const PasswordRenewForm: React.FC<{ token: string }> = ({ token }) => {
  const form = useForm({
    resolver: zodResolver(passwordRenewSchema),
  })

  const handleSubmitMutation = useMutation({
    mutationFn: async (data: PasswordRenewSchemaTypes) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/passwordRenewHandler',
          method: 'post',
          data: { ...data, token },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success) {
        modals.open({
          withCloseButton: false,
          closeOnClickOutside: false,
          closeOnEscape: false,
          children: (
            <div className='grid grid-cols-1 gap-3 text-center'>
              <div className='flex items-center justify-center text-center text-green-800'>
                <div>
                  <GoCheckCircleFill size={45} />
                </div>
              </div>
              <Title c={'green.8'} fz={'h2'}>
                İşleminiz tamamlandı.
              </Title>
              <Text>
                Hesabınıza giriş için kullandığınız güvenlik şifresi
                değiştirilmiştir.
              </Text>
              <div>
                <Button
                  component={Link}
                  href={'/auth/login'}
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Tekrar giriş yapın
                </Button>
              </div>
            </div>
          ),
        })
      } else {
        modals.open({
          title: 'Bir sorun oluştu',
          children: (
            <div className='grid grid-cols-1 gap-3 text-center'>
              <Text>
                Daha önce bu bağlantı ile işlem yapmış olabilirsiniz. Eğer
                şifrenizi unuttuysanız tekrar{' '}
                <Link
                  href={'/auth/forgot-password' as Route}
                  className='text-blue-800 hover:underline'
                  onClick={() => {
                    modals.closeAll()
                  }}
                >
                  Şifremi Unuttum
                </Link>{' '}
                sayfasını ziyaret edebilirsiniz.
              </Text>
              <div>
                <Button component={Link} href={'/auth/login'}>
                  Giriş yap
                </Button>
              </div>
            </div>
          ),
        })
      }
    },
  })

  return (
    <div>
      <Title className='text-center' fz={'h2'} mb={'lg'}>
        Yeni şifrenizi oluşturun
      </Title>
      <Text className='text-center'>
        Şifreniz en az 8 karakterden oluşmalıdır. Büyük ve küçük harfler bir
        arada kullanılmalıdır. Şifrenizde sıralı veya tekrar eden rakamlar
        kullanılmamalıdır.
      </Text>
      <form
        onSubmit={form.handleSubmit((data) => {
          handleSubmitMutation.mutate(data)
        })}
        className='mx-auto grid max-w-2/3 grid-cols-1 gap-4 py-5'
      >
        <div>
          <PasswordInput
            {...form.register('password')}
            label='Yeni Şifreniz'
            placeholder='Yeni Şifreniz'
            error={form.formState.errors.password?.message}
          />
        </div>
        <div>
          <PasswordInput
            {...form.register('repeatPassword')}
            label='Yeni Şifrenizi Doğrulayın'
            placeholder='Yeni Şifrenizi Doğrulayın'
            error={form.formState.errors.repeatPassword?.message}
          />
        </div>
        <div className='text-center'>
          <Button type='submit'>Devam et</Button>
        </div>
      </form>
    </div>
  )
}

export { PasswordRenewForm }
