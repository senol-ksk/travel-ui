import Loading from '@/app/online-operations/loading'
import { serviceRequest } from '@/network'
import { Button, Center, Container, Skeleton, Text } from '@mantine/core'
import { Link } from 'next-view-transitions'
import { redirect, RedirectType } from 'next/navigation'
import { Suspense } from 'react'

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  const confirmResponse = await serviceRequest({
    axiosOptions: {
      url: 'api/account/confirmRegisterEmail',
      params: {
        token,
      },
    },
  })

  if (!confirmResponse?.success) redirect('/')

  return (
    <Container className='mt-10 border p-5' maw={500} bdrs={'md'}>
      <Suspense
        fallback={<Skeleton h={20} radius={'md'} w={{ md: '50%' }} mx='auto' />}
      >
        <Center>
          <div className='text-center'>
            <Text mb={'lg'}>
              E-posta doğrulaması tamamlandı. Hesabınızı kullanmaya
              başlayabilirsiniz.
            </Text>
            <Button component={Link} href={'/auth/login'}>
              Giriş Yap
            </Button>
          </div>
        </Center>
      </Suspense>
    </Container>
  )
}
