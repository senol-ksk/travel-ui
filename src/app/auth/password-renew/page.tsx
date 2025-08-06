import { Container, Text, Title } from '@mantine/core'
import { notFound } from 'next/navigation'
import { PasswordRenewForm } from './_password-renew-form'
import { serviceRequest } from '@/network'

export default async function PasswordRenewPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  const checkToken = await serviceRequest({
    axiosOptions: {
      url: 'api/account/checkForgotPasswordToken',
      params: { token },
    },
  })

  if (!token || !checkToken?.success) notFound()

  return (
    <Container mt={'lg'} maw={600} className='rounded border p-3 md:p-5'>
      <PasswordRenewForm token={token} />
    </Container>
  )
}
