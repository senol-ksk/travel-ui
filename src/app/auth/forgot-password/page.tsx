'use client'

import { Button, Container, Text, TextInput, Title } from '@mantine/core'
import { z } from '@/libs/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordAction } from './actions'
import { useMutation } from '@tanstack/react-query'
import { modals } from '@mantine/modals'
import { Link } from 'next-view-transitions'

const schema = z.object({
  email: z.string().email(),
})

type SchemaType = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const handleSubmitMutation = useMutation({
    mutationFn: (data: SchemaType) =>
      forgotPasswordAction({ ...data, siteURL: window.location.origin + '/' }),
    onSuccess(data) {
      modals.open({
        children: (
          <div className='text-center'>
            <Text mb={'sm'}>
              Şifre yenilemek için e-posta adresinize gelen linki tıklayarak
              devam edebilirsiniz.
            </Text>
            <div>
              <Button component={Link} href={'/'} onClick={modals.closeAll}>
                Ana Sayfa
              </Button>
            </div>
          </div>
        ),
        withCloseButton: false,
        closeOnEscape: false,
        closeOnClickOutside: false,
      })
    },
  })

  return (
    <Container
      display={'block'}
      mt={'xl'}
      maw={1000}
      className='rounded border p-3 md:p-5'
      component={'form'}
      onSubmit={form.handleSubmit((data) => handleSubmitMutation.mutate(data))}
    >
      <Title className='text-center' fz={'h2'} mb={'lg'}>
        Şifremi Unuttum
      </Title>
      <Text className='text-center'>
        Lütfen kayıt olurken kullandığınız <strong>E-posta</strong> adresini
        girin.
      </Text>
      <div className='py-md mt-5 md:px-80'>
        <TextInput
          {...form.register('email')}
          autoComplete='username'
          type='email'
          label='E-Posta'
          placeholder='E-posta'
          error={form.formState.errors.email?.message}
        />
        <div className='mt-5 text-center'>
          <Button type='submit' loading={handleSubmitMutation.isPending}>
            Devam et
          </Button>
        </div>
      </div>
      <Text fz='xs' c='dark.2' mt={32} className='text-center'>
        Şifre Değiştirme e-postası Gelen kutunuzda değilse, spam ya da junk
        klasörlerinizi kontrol ediniz.
      </Text>
    </Container>
  )
}
