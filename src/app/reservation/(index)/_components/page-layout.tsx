'use client'

import { useDisclosure } from '@mantine/hooks'
import { Drawer, ScrollArea, Skeleton, Title } from '@mantine/core'
import { MdDescription, MdTimer } from 'react-icons/md'

import { ReservationSummarySection } from '@/app/reservation/(index)/summary-section'
import { CheckoutProvider } from '../../store'
import { useRef } from 'react'
import { useCheckoutMethods } from '../../checkout-query'
import { CheckoutCard } from '@/components/card'

export const ReservationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const { checkoutDataQuery } = useCheckoutMethods()

  if (
    (!checkoutDataQuery.data || !checkoutDataQuery.data.data) &&
    checkoutDataQuery.isLoading
  )
    return (
      <div className='grid gap-3 md:grid-cols-3'>
        <div className='order-1 md:col-span-2'>
          <div className='mb-4 rounded-md border bg-white p-6 shadow'>
            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <Skeleton h={10} radius='md' />
                <Skeleton h={10} radius='md' />
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <Skeleton h={30} radius='md' />
                <Skeleton h={30} radius='md' />
              </div>
            </div>
          </div>

          <div className='rounded-md border bg-white p-6 shadow'>
            <div className='space-y-2'>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <Skeleton h={10} radius='md' />
                <Skeleton h={10} radius='md' />
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <Skeleton h={30} radius='md' />
                <Skeleton h={30} radius='md' />
              </div>
            </div>
          </div>
        </div>

        <div className='sticky top-0 z-10 order-2 flex h-fit flex-col gap-3 md:order-1'>
          <div className='grid gap-5'>
            <div className='hidden rounded-md border p-2 shadow-xs md:block md:p-4'>
              <Skeleton h={16} w='80%' radius='md' />
            </div>

            <div className='rounded-md border bg-white p-4 shadow'>
              <div className='space-y-3'>
                <Skeleton h={20} w='50%' radius='md' />
                <Skeleton h={16} w='70%' radius='md' />
                <Skeleton h={16} w='60%' radius='md' />
                <div className='border-t pt-3'>
                  <Skeleton h={18} w='40%' radius='md' />
                  <Skeleton h={24} w='80%' radius='md' className='mt-2' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  if (!checkoutDataQuery.data || checkoutDataQuery.data?.errors) {
    return (
      <CheckoutCard>
        <Title>Bir hata olustu</Title>
      </CheckoutCard>
    )
  }

  const totalPrice =
    checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
      .summaryResponse.totalPrice

  return (
    <CheckoutProvider totalPrice={totalPrice ?? 0}>
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
    </CheckoutProvider>
  )
}
