import { Container, rem } from '@mantine/core'
import AccountSideNav from './_components/side-nav'
import { auth } from '../auth'
import { redirect } from 'next/navigation'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) return redirect('/auth/login')

  return (
    <Container py={rem(20)}>
      <div className='relative grid grid-cols-1 gap-4 md:grid-cols-5'>
        <div>
          <div className='sticky top-2'>
            <AccountSideNav />
          </div>
        </div>
        <div className='col-span-4'>{children}</div>
      </div>
    </Container>
  )
}
