import { Container, Title } from '@mantine/core'
import { auth } from '@/app/auth'
import { LoginForm } from './_components/login-form'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await auth()

  if (session) redirect('/')

  return (
    <Container size={'xs'} className='flex flex-col gap-4 py-4'>
      <Title className='text-center'>Oturum Açın</Title>
      <div>
        <LoginForm />
      </div>
    </Container>
  )
}
