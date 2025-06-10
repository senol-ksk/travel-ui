import { Suspense } from 'react'
import { Card, Container } from '@mantine/core'

import { ReservationSummarySection } from './summary-section'

// import '@/styles/reservation.css'
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
            <div className='sticky end-0 top-2 grid gap-5'>
              <div className='rounded-md border bg-white p-2 shadow-xs md:p-4'>
                Oturumun aktif kalması için ödemenizi <br />
                <span className='px-1 font-bold text-orange-500'>
                  20 dakika
                </span>
                içinde tamamlayın!
              </div>
              <ReservationSummarySection />
            </div>
          </div>
        </div>
      </Container>
    </Suspense>
  )
}
