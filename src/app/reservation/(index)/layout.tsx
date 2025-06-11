'use client'
import { Suspense } from 'react'
import { Button, Card, Container, Drawer, ScrollArea } from '@mantine/core'

import { ReservationSummarySection } from './summary-section'
import { BsSuitcaseLg } from 'react-icons/bs'
import { useDisclosure } from '@mantine/hooks'

// import '@/styles/reservation.css'
export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  return (
    <Suspense>
      <Container className='px-0 py-2 md:px-3 md:py-5'>
        <div className='grid gap-3 md:grid-cols-3 md:gap-4'>
          <div className='order-1 md:col-span-2'>{children}</div>
          <div className='sticky top-0 z-10 order-2 flex h-fit flex-col gap-3 md:order-1'>
            <div className='grid gap-5'>
              <div
                className='mb-3 flex items-center gap-5 rounded-md border bg-white p-5 text-lg font-semibold shadow-xs md:hidden md:p-4'
                typeof='button'
                role='button'
                onClick={openDrawer}
              >
                <BsSuitcaseLg />
                <div>Seyahat Özeti</div>
              </div>
              <Drawer
                offset={8}
                radius='md'
                opened={drawerOpened}
                onClose={closeDrawer}
                title='Seyahat Özeti'
                scrollAreaComponent={ScrollArea.Autosize}
              >
                <ReservationSummarySection />
              </Drawer>
              <div className='hidden rounded-md border border-amber-400 bg-orange-50 p-2 shadow-xs md:block md:p-4'>
                Oturumun aktif kalması için ödemenizi <br />
                <span className='px-1 font-bold text-orange-500'>
                  20 dakika
                </span>
                içinde tamamlayın!
              </div>
              <div className='hidden md:block'>
                <ReservationSummarySection />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Suspense>
  )
}
