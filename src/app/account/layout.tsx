import { Container, rem } from '@mantine/core'
import { auth } from '../auth'
import { redirect } from 'next/navigation'
import ClientAccountLayout from './passengers/_components/client-account-layout'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) return redirect('/auth/login')
  return (
    <Container py={rem(20)}>
      <div className='gap-4 md:grid md:grid-cols-8'>
        <ClientAccountLayout />
        <div className='col-span-6'>{children}</div>
      </div>
    </Container>
  )
}
