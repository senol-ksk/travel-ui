import { Suspense } from 'react'
import { Container } from '@mantine/core'

export default function ReservationMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense>
      <Container className='py-5'>{children}</Container>
    </Suspense>
  )
}
