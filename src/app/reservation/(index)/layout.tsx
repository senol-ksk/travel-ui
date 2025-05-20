import { Suspense } from 'react'

import { ReservationSummarySection } from './summary-section'
import { Container } from '@mantine/core'

export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense>
      <Container className='py-2 md:py-5'>
        <div className='grid gap-3 md:grid-cols-3 md:gap-4'>
          <div className='order-2 md:order-1 md:col-span-2'>{children}</div>
          <div className='relative md:order-2'>
            <div className='sticky end-0 top-2'>
              <ReservationSummarySection />
            </div>
          </div>
        </div>
      </Container>
    </Suspense>
  )
}
