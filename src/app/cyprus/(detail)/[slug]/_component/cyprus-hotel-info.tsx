'use client'

import { useState } from 'react'
import { Text, Button } from '@mantine/core'
import { BiChevronRight } from 'react-icons/bi'
import { CyprusHotelDetailApiResponse } from '@/app/cyprus/types'
import { useDisclosure } from '@mantine/hooks'
import { MainDrawer } from '@/app/hotel/(detail)/[slug]/_components/main-drawer'
import {
  HotelDetailDescription,
  HotelDetailResponseHotelInfo,
} from '@/app/hotel/types'
import { HotelDrawers } from '@/app/hotel/(detail)/[slug]/_components/hotel-drawers'
import {
  IconCheckIn,
  IconCheckOut,
} from '@/app/hotel/(detail)/[slug]/_components/icons'

type Iprops = {
  displayData?: CyprusHotelDetailApiResponse
  hotelInfo: HotelDetailResponseHotelInfo
}

export const CyprusHotelInfo: React.FC<Iprops> = ({
  displayData,
  hotelInfo,
}) => {
  const [showCommentsTab, setShowCommentsTab] = useState(false)
  const [
    generalInfoDrawerOpened,
    { open: openGeneralInfoDrawer, close: closeGeneralInfoDrawer },
  ] = useDisclosure(false)

  const handleCommentClick = () => {
    setShowCommentsTab(true)
    openGeneralInfoDrawer()
  }
  return (
    <div className='grid'>
      <div className='hidden items-center justify-between rounded bg-white p-3 md:flex'>
        <div className='hidden items-center gap-2 self-end text-blue-800 md:flex'>
          <div className='rounded-md bg-blue-100 p-4 px-5 text-xl leading-none font-bold'>
            {hotelInfo?.hotel?.comment_info?.averageScore}
          </div>
          <div className='text-xl font-medium'>Mükemmel</div>
        </div>
        <div className='flex items-center'>
          <Button
            className='border-0 bg-transparent p-0 text-sm font-normal text-blue-700'
            size='md'
            onClick={handleCommentClick}
          >
            {hotelInfo?.hotel?.comment_info?.totalComments} değerlendirme
          </Button>
          <BiChevronRight size={20} color='blue' />
        </div>
      </div>
      <div
        className='hidden gap-3 rounded bg-white p-3 md:grid'
        data-heading='Konum'
      >
        <div className='col-span-12 hidden gap-3 md:flex'>
          <iframe
            src='https://maps.google.com/maps?q=35.379585,34.08901&amp;output=embed&amp;hl=en'
            style={{ width: '116px', height: '110px' }}
            className='rounded-md border-0'
            allowFullScreen
          ></iframe>
          <div className='grid'>
            <Text className='font-medium'>Konum</Text>
            <div className='text-sm font-normal'>
              {hotelInfo?.hotel?.address}
            </div>
            <div className='flex items-center'>
              <Button
                className='border-0 bg-transparent p-0 font-normal text-blue-700'
                size='sm'
                onClick={() => {}}
              >
                Oteli haritada gör
              </Button>
              <BiChevronRight size={20} color='blue' />
            </div>
          </div>
        </div>
      </div>
      <div className='hidden justify-between gap-5 rounded bg-white px-6 py-3 md:flex'>
        <div className='flex items-center gap-2'>
          <div>
            <IconCheckIn />
          </div>
          <div>
            <Text>Check-in</Text>
            <Text size='sm'>{hotelInfo?.hotel?.checkin_from}</Text>
          </div>
        </div>
        <div className='flex items-center gap-2 border-s ps-5'>
          <div>
            <IconCheckOut />
          </div>
          <div>
            <Text>Check-out</Text>
            <Text size='sm'>{hotelInfo?.hotel?.checkout_to}</Text>
          </div>
        </div>
      </div>

      <HotelDrawers
        description={hotelInfo?.hotel.descriptions as HotelDetailDescription}
      />

      <MainDrawer
        opened={generalInfoDrawerOpened}
        onClose={closeGeneralInfoDrawer}
        data={hotelInfo}
        description={hotelInfo?.hotel.descriptions as HotelDetailDescription}
        showCommentsTab={showCommentsTab}
      />
    </div>
  )
}
