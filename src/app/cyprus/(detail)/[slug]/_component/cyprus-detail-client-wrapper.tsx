'use client'

import { useState } from 'react'
import { Button, Title } from '@mantine/core'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { FacilityProps } from '@/app/hotel/(detail)/[slug]/_components/facility-props'
import { Comments } from '@/app/hotel/(detail)/[slug]/_components/comments'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import { Location } from '@/app/hotel/(detail)/[slug]/_components/location'
import { ImportantInfos } from '@/app/hotel/(detail)/[slug]/_components/important-infos'
import { MainDrawer } from '@/app/hotel/(detail)/[slug]/_components/main-drawer'
import { useDisclosure } from '@mantine/hooks'

type ClientWrapperProps = {
  hotelInfo: HotelDetailResponseHotelInfo
}

export const CyprusDetailClientWrapper: React.FC<ClientWrapperProps> = ({
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
    <>
      <div className='border-md rounded bg-gray-50 p-1 md:p-3'>
        <FacilityProps
          descriptions={hotelInfo.hotel.descriptions}
          data={hotelInfo}
          onOpenDrawer={openGeneralInfoDrawer}
        />
      </div>

      {(hotelInfo?.hotel?.comment_info?.comments?.length ?? 0) > 0 && (
        <div>
          <Title
            order={2}
            id='ratings'
            pb={'md'}
            className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
          >
            Değerlendirmeler
          </Title>
          <div>
            <div className='gap-2 rounded bg-gray-50 p-3'>
              <div className='flex items-center justify-between rounded-lg bg-white p-3'>
                <div className='hidden items-center gap-2 text-blue-800 md:flex'>
                  <div className='rounded-md bg-blue-100 p-4 px-5 text-xl leading-none font-bold'>
                    {hotelInfo?.hotel?.comment_info?.averageScore}
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='text-xl font-normal'>Mükemmel</div>
                    <div className='flex items-center'>
                      <Button
                        className='border-0 bg-transparent p-0 text-sm font-normal text-black'
                        size='md'
                        onClick={handleCommentClick}
                      >
                        {hotelInfo?.hotel?.comment_info?.comments?.length ?? 0}{' '}
                        değerlendirme
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCommentClick}
                  className='bg-transparent p-0 font-normal text-blue-700'
                >
                  Tüm Yorumları Göster <MdKeyboardArrowRight size={20} />
                </Button>
              </div>
              <div className='mt-3 rounded-xl bg-white'>
                {hotelInfo?.hotel?.comment_info && (
                  <Comments
                    data={hotelInfo?.hotel?.comment_info}
                    onCommentClick={handleCommentClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Title
        order={2}
        id='location'
        className='md:text-xxl p-2 pt-6 text-xl md:mt-6 md:p-0'
      >
        Konum Bilgileri{' '}
      </Title>
      <div>
        <Location
          location={hotelInfo?.hotel?.location || [0, 0]}
          data={hotelInfo}
        />
      </div>
      {hotelInfo?.hotel?.descriptions?.importentInfo && (
        <div>
          <Title order={2} className='mb-3 p-2 pt-6 md:mt-6 md:p-0'>
            Önemli Bilgiler{' '}
          </Title>
          <div>
            <ImportantInfos
              description={hotelInfo?.hotel?.descriptions}
              data={hotelInfo}
            />
          </div>
        </div>
      )}
      <MainDrawer
        opened={generalInfoDrawerOpened}
        onClose={closeGeneralInfoDrawer}
        data={hotelInfo}
        description={hotelInfo?.hotel.descriptions}
        showCommentsTab={showCommentsTab}
      />
    </>
  )
}
