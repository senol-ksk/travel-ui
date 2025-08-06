import { Container, Title } from '@mantine/core'
import { auth } from '@/app/auth'
import { LoginForm } from './_components/login-form'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()

  if (session) redirect('/')

  return (
    <Container size={'xs'} className='flex flex-col gap-4 py-10'>
      <div className='rounded-lg border p-3 py-10 shadow'>
        <Title className='text-center'>Giriş Yap</Title>
        <div>
          <LoginForm />
        </div>
      </div>
    </Container>
  )
}
