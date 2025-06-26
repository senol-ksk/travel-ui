import React, { useState } from 'react'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'

import { Drawer, Button, Title, TypographyStylesProvider } from '@mantine/core'
import { HotelDetailDescription } from '@/app/hotel/types'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import { MdKeyboardArrowRight, MdOutlineBed } from 'react-icons/md'
import { FaDoorOpen, FaGlassMartiniAlt, FaRegBuilding } from 'react-icons/fa'
import { LuScan } from 'react-icons/lu'
import { FaBellConcierge } from 'react-icons/fa6'

type IProps = {
  description: HotelDetailDescription
  data: HotelDetailResponseHotelInfo | undefined
}

const GeneralDrawer: React.FC<IProps> = ({ description, data }) => {
  const { ref: generalInfoContentRef, height: generalInfoContentHeight } =
    useElementSize()
  const GENERAL_INFO_MAX_HEIGHT = 150
  const [
    generalInfoDrawerOpened,
    { open: openGeneralInfoDrawer, close: closeGeneralInfoDrawer },
  ] = useDisclosure(false)

  return (
    <>
      {description && description.hotelInformation ? (
        <div className='rounded bg-white p-3'>
          <div ref={generalInfoContentRef}>
            <Title
              order={3}
              fz={'h4'}
              className='flex items-center gap-2 py-2 font-medium'
            >
              <FaRegBuilding />
              <div>Otel Özellikleri</div>
            </Title>
            <div className='my-4 border-t'></div>
            <ul className='grid grid-cols-5 gap-2'>
              {data?.facilityTypes &&
                data.facilityTypes.slice(0, 20).map((facility, index) => (
                  <li className='truncate' key={index}>
                    {facility.name}
                  </li>
                ))}
            </ul>
          </div>
          <input value={JSON.stringify(data?.hotel, null, 2)} readOnly />
          <div className='my-10'>
            <ul className='grid-cols-auto flex gap-2'>
              {/* <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                <LuScan size={24} className='text-blue-700' />
                <div className='grid gap-0'>
                  <div className='font-medium text-blue-800'>Alan (m2)</div>
                  <div className='font-semibold'>{} </div>
                </div>
              </li> */}
              {data?.hotel.year_built && (
                <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                  <FaRegBuilding size={24} className='text-blue-700' />
                  <div className='grid gap-0'>
                    <div className='font-medium text-blue-800'>Bina Yaşı</div>
                    <div className='font-semibold'>
                      {' '}
                      {data?.hotel.year_built}
                    </div>
                  </div>
                </li>
              )}
              {data?.hotel.nr_rooms && (
                <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                  <MdOutlineBed size={24} className='text-blue-700' />
                  <div className='grid gap-0'>
                    <div className='font-medium text-blue-800'>Oda</div>
                    <div className='font-semibold'> {data?.hotel.nr_rooms}</div>
                  </div>
                </li>
              )}
              {data?.hotel.nr_restaurants && data?.hotel.nr_restaurants > 0 && (
                <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                  <FaBellConcierge size={24} className='text-blue-700' />
                  <div className='grid gap-0'>
                    <div className='font-medium text-blue-800'>Restaurant</div>
                    <div className='font-semibold'>
                      {data?.hotel.nr_restaurants}
                    </div>
                  </div>
                </li>
              )}
              {data?.hotel.nr_bars && (
                <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                  <FaGlassMartiniAlt size={24} className='text-blue-700' />
                  <div className='grid gap-0'>
                    <div className='font-medium text-blue-800'>Bar</div>
                    <div className='font-semibold'>{data?.hotel.nr_bars}</div>
                  </div>
                </li>
              )}
              {data?.hotel.nr_halls && (
                <li className='flex items-center gap-3 rounded border bg-gray-200 p-1 px-4'>
                  <FaDoorOpen size={24} className='text-blue-700' />
                  <div className='grid gap-0'>
                    <div className='font-medium text-blue-800'>Salon</div>
                    <div className='font-semibold'>{data?.hotel.nr_halls}</div>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div
            style={{
              maxHeight: `170px`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <TypographyStylesProvider>
              <div
                ref={generalInfoContentRef}
                dangerouslySetInnerHTML={{
                  __html: description.hotelInformation.trim(),
                }}
              />
            </TypographyStylesProvider>
            {generalInfoContentHeight > GENERAL_INFO_MAX_HEIGHT && (
              <div className='absolute right-0 bottom-0 left-0 h-10'></div>
            )}
          </div>

          {generalInfoContentHeight > GENERAL_INFO_MAX_HEIGHT && (
            <Button
              onClick={openGeneralInfoDrawer}
              className='bg-transparent p-0 font-normal text-blue-700'
            >
              Tesisin tüm olanaklarını görün
              <MdKeyboardArrowRight size={20} />
            </Button>
          )}
        </div>
      ) : null}
      {description && description.hotelInformation && (
        <Drawer
          opened={generalInfoDrawerOpened}
          onClose={closeGeneralInfoDrawer}
          title='Genel Bilgiler'
          position='right'
          size='xl'
        >
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: description.hotelInformation.trim(),
              }}
            />
          </TypographyStylesProvider>
        </Drawer>
      )}
    </>
  )
}

export { GeneralDrawer }
