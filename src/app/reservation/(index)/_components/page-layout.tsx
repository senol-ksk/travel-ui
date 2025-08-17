'use client'

import { useDisclosure } from '@mantine/hooks'
import { Drawer, ScrollArea } from '@mantine/core'
import { MdDescription, MdTimer } from 'react-icons/md'

import { ReservationSummarySection } from '@/app/reservation/(index)/summary-section'

export const ReservationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  return (
    <div className='grid gap-3 md:grid-cols-3 md:gap-4'>
      <div className='order-1 md:col-span-2'>{children}</div>
      <div className='sticky top-0 z-10 order-2 flex h-fit flex-col gap-3 md:order-1'>
        <div className='grid gap-5'>
          <div
            className='mb-3 flex items-center gap-5 rounded-md border bg-white p-5 text-lg font-semibold shadow-xs md:hidden md:p-4'
            role='button'
            onClick={openDrawer}
          >
            <MdDescription size={22} className='text-blue-800' />
            <div>Seyahat Özeti</div>
          </div>
          <Drawer
            offset={8}
            radius='md'
            opened={drawerOpened}
            onClose={closeDrawer}
            title={
              <div className='flex items-center gap-2'>
                <MdDescription size={22} className='text-blue-800' />
                <span className='text-xl font-semibold'>Seyahat Özeti</span>
              </div>
            }
            scrollAreaComponent={ScrollArea.Autosize}
          >
            <ReservationSummarySection />
          </Drawer>
          <div className='hidden rounded-md border border-amber-400 bg-orange-50 p-2 shadow-xs md:block md:p-4'>
            <span className='flex items-start gap-2'>
              <MdTimer size={22} className='text-orange-800' />
              <span>
                Oturumun aktif kalması için ödemenizi <br />
                <span className='px-1 font-bold text-orange-500'>
                  20 dakika
                </span>
                içinde tamamlayın!
              </span>
            </span>
          </div>
          <div className='hidden md:block'>
            <ReservationSummarySection />
          </div>
        </div>
      </div>
    </div>
  )
}
