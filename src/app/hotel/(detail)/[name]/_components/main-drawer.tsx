import React, { JSX } from 'react'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import {
  FaBed,
  FaCircle,
  FaUtensils,
  FaHeart,
  FaStar,
  FaSpa,
  FaLocationPin,
  FaBriefcase,
  FaSnowflake,
  FaBellConcierge,
} from 'react-icons/fa6'
import {
  FaCalendarAlt,
  FaRegFileAlt,
  FaRunning,
  FaSwimmer,
} from 'react-icons/fa'
import { MdNotificationImportant, MdOutlineCalendarMonth } from 'react-icons/md'
import { PiConfettiBold } from 'react-icons/pi'
const titleTranslations = {
  hotelInformation: 'Otel Bilgisi',
  hotelAmenity: 'Otel Olanakları',
  roomAmenity: 'Oda Olanakları',
  locationInformation: 'Konum Bilgisi',
  hotelIntroduction: 'Otel Tanıtımı',
  attractionInformation: 'Çekim Bilgileri',
  dining: 'Yemek Bilgileri',
  areaAttractions: 'Bölge Çekim Alanları',
  recreation: 'Rekreasyon',
  policy: 'Politikalar',
  spa: 'Spa Bilgileri',
  whatToExpect: 'Beklentiler',
  businessAmenities: 'İşletme Olanakları',
  beachPool: 'Plaj ve Havuz',
  honeymoonInformation: 'Balayı Bilgileri',
  specialDays: 'Özel Günler',
  activities: 'Aktiviteler',
  importentInfo: 'Önemli Bilgiler',
}
const titleIcons: Record<string, JSX.Element> = {
  hotelInformation: <FaBellConcierge />,
  hotelAmenity: <FaStar />,
  roomAmenity: <FaBed />,
  locationInformation: <FaLocationPin />,
  hotelIntroduction: <FaCircle />,
  attractionInformation: <FaCalendarAlt />,
  dining: <FaUtensils />,
  areaAttractions: <MdOutlineCalendarMonth />,
  recreation: <FaRunning />,
  policy: <FaRegFileAlt />,
  spa: <FaSpa />,
  whatToExpect: <FaCircle />,
  businessAmenities: <FaBriefcase />,
  beachPool: <FaSwimmer />,
  honeymoonInformation: <FaHeart />,
  specialDays: <PiConfettiBold />,
  activities: <FaRunning />,
  importentInfo: <MdNotificationImportant />,
}
import {
  Drawer,
  TypographyStylesProvider,
  Tabs,
  Accordion,
} from '@mantine/core'
import { HotelDetailDescription } from '@/app/hotel/types'
import { CommentsDrawer } from './comments-drawer'
import { IoClose } from 'react-icons/io5'

type IProps = {
  description: HotelDetailDescription
  data: HotelDetailResponseHotelInfo | undefined
  opened: boolean
  onClose: () => void
}

const MainDrawer: React.FC<IProps> = ({
  description,
  data,
  opened,
  onClose,
}) => {
  const featureValues = Object.entries(description)
  if (featureValues.length === 0) return null

  return (
    <>
      <>
        {description && description.hotelInformation && (
          <Drawer
            opened={opened}
            onClose={onClose}
            title={
              <div className='mb-4 flex items-center border-b pb-2'>
                <button
                  onClick={onClose}
                  className='rounded-full bg-red-800 p-2 text-white'
                >
                  <IoClose color='white' />
                </button>
              </div>
            }
            position='right'
            size='xl'
            className='border-gray-300 p-3'
            closeButtonProps={{
              style: { display: 'none' },
            }}
          >
            <div className='flex gap-5'>
              <Tabs defaultValue='facilityInfos'>
                <Tabs.List className='text-3xl font-bold'>
                  <Tabs.Tab
                    value='facilityInfos'
                    className='text-2xl font-bold'
                  >
                    Tesis Bilgileri
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='drawerComments'
                    className='text-2xl font-bold'
                  >
                    Yorumlar
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='facilityInfos' className='p-4'>
                  <div className='grid gap-3'>
                    <div className='flex'>
                      <div className='leading-lg inline-flex items-center gap-3 rounded-md bg-gray-200 px-3 py-2'>
                        <FaSnowflake />
                        <div>
                          <div className='font-semibold'>Kış Sezonu</div>
                          <div>13.03.2025 - 23.11.2025</div>
                        </div>
                      </div>
                    </div>
                    <TypographyStylesProvider>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: description.hotelInformation.trim(),
                        }}
                      />
                    </TypographyStylesProvider>
                    <Accordion className='grid gap-3 rounded'>
                      {featureValues.map(([key, value], itemIndex) => {
                        if (!value?.trim()) return null

                        const title =
                          titleTranslations[
                            key as keyof typeof titleTranslations
                          ] || key
                        const Icon = titleIcons[key]

                        return (
                          <Accordion.Item
                            key={itemIndex}
                            value={String(itemIndex)}
                            className='rounded bg-white shadow-sm'
                          >
                            <Accordion.Control className='flex w-full items-center gap-5 text-lg font-semibold'>
                              <div className='flex items-center gap-3'>
                                {Icon && (
                                  <span className='inline-flex items-center justify-center gap-5'>
                                    {Icon}
                                  </span>
                                )}
                                <span>{title}</span>
                              </div>
                            </Accordion.Control>

                            <Accordion.Panel className='mt-2 w-full'>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: value || '',
                                }}
                              />
                            </Accordion.Panel>
                          </Accordion.Item>
                        )
                      })}
                    </Accordion>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel value='drawerComments'>
                  {' '}
                  {data?.hotel.comment_info && (
                    <div>
                      <CommentsDrawer data={data?.hotel.comment_info} />
                    </div>
                  )}
                </Tabs.Panel>
              </Tabs>
            </div>
          </Drawer>
        )}
      </>
    </>
  )
}

export { MainDrawer }
