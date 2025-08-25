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
  FaDoorOpen,
  FaGlassMartiniAlt,
  FaRegBuilding,
  FaRegFileAlt,
  FaRunning,
  FaSwimmer,
} from 'react-icons/fa'
import {
  MdNotificationImportant,
  MdOutlineBed,
  MdOutlineCalendarMonth,
} from 'react-icons/md'
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
import { Drawer, Tabs, Accordion, Spoiler, Title } from '@mantine/core'
import { HotelDetailDescription } from '@/app/hotel/types'
import { CommentsDrawer } from './comments-drawer'
import { IoClose } from 'react-icons/io5'
import { BsCheck } from 'react-icons/bs'

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
      <div>
        {description && description.hotelInformation && (
          <Drawer
            opened={opened}
            onClose={onClose}
            title={
              <div className='flex items-center p-0'>
                <button
                  onClick={onClose}
                  className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
                >
                  <IoClose color='white' />
                </button>
              </div>
            }
            position='right'
            size='xl'
            radius='sm'
            closeButtonProps={{
              style: { display: 'none' },
            }}
            classNames={{
              header: 'p-0',
              body: 'p-0 md:p-3',
            }}
          >
            <div className='flex gap-5'>
              <Tabs
                defaultValue='facilityInfos'
                classNames={{
                  tab: 'border-b-5 rounded md:p-1',
                  tabSection: 'hidden sm:flex',
                  tabLabel: 'flex-none',
                }}
              >
                <Tabs.List className='flex justify-around text-xl font-bold'>
                  <Tabs.Tab
                    value='facilityInfos'
                    className='text-xl font-semibold'
                  >
                    Tesis Bilgileri
                  </Tabs.Tab>
                  {(data?.hotel.comment_info?.comments?.length ?? 0) > 0 && (
                    <Tabs.Tab
                      value='drawerComments'
                      className='text-xl font-semibold'
                    >
                      Yorumlar
                    </Tabs.Tab>
                  )}
                </Tabs.List>

                <Tabs.Panel value='facilityInfos' className='py-2 md:p-4'>
                  <div className='rounded bg-gray-50 p-1 md:p-3'>
                    <div className='grid rounded'>
                      <div className='mb-5 flex'>
                        <div className='leading-lg inline-flex items-center gap-3 rounded-md bg-gray-200 px-3 py-2'>
                          <FaSnowflake />
                          <div>
                            <div className='font-semibold'>Kış Sezonu</div>
                            <div>13.03.2025 - 23.11.2025</div>
                          </div>
                        </div>
                      </div>

                      <div className='rounded bg-white md:p-3'>
                        <div>
                          <Title
                            order={3}
                            fz={'h4'}
                            className='flex items-center gap-2 py-2 font-medium'
                          >
                            <FaRegBuilding />
                            <div>Otel Özellikleri</div>
                          </Title>
                          <div className='my-4 border-t'></div>
                          <Spoiler
                            className='ms-auto mb-15 pb-3'
                            showLabel='Daha fazla göster'
                            hideLabel='Daha az göster'
                          >
                            <ul className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                              {data?.facilityTypes &&
                                data.facilityTypes
                                  .slice(0, 100)
                                  .map((facility, index) => (
                                    <li className='truncate' key={index}>
                                      <BsCheck className='mr-1 inline-block text-blue-800' />
                                      {facility.name}
                                    </li>
                                  ))}
                            </ul>
                          </Spoiler>
                        </div>
                        <div className='overflow-x-auto'>
                          <ul className='grid-cols-auto my-2 flex w-[100px] gap-2'>
                            {data?.hotel.year_built && (
                              <li className='flex items-center gap-3 rounded border bg-gray-50 p-1 px-4'>
                                <FaRegBuilding
                                  size={24}
                                  className='text-blue-700'
                                />
                                <div className='grid gap-0'>
                                  <div className='font-medium text-blue-800'>
                                    Bina Yaşı
                                  </div>
                                  <div className='font-semibold'>
                                    {' '}
                                    {data?.hotel.year_built}
                                  </div>
                                </div>
                              </li>
                            )}
                            {Number(data?.hotel.nr_rooms) > 0 && (
                              <li className='flex items-center gap-3 rounded border bg-gray-50 p-1 px-4'>
                                <MdOutlineBed
                                  size={24}
                                  className='text-blue-700'
                                />
                                <div className='grid gap-0'>
                                  <div className='font-medium text-blue-800'>
                                    Oda
                                  </div>
                                  <div className='font-semibold'>
                                    {' '}
                                    {data?.hotel.nr_rooms}
                                  </div>
                                </div>
                              </li>
                            )}
                            {Number(data?.hotel.nr_restaurants) > 0 && (
                              <li className='flex items-center gap-3 rounded border bg-gray-50 p-1 px-4'>
                                <FaBellConcierge
                                  size={24}
                                  className='text-blue-700'
                                />
                                <div className='grid gap-0'>
                                  <div className='font-medium text-blue-800'>
                                    Restaurant
                                  </div>
                                  <div className='font-semibold'>
                                    {data?.hotel.nr_restaurants}
                                  </div>
                                </div>
                              </li>
                            )}
                            {Number(data?.hotel.nr_bars) > 0 && (
                              <li className='flex items-center gap-3 rounded border bg-gray-50 p-1 px-4'>
                                <FaGlassMartiniAlt
                                  size={24}
                                  className='text-blue-700'
                                />
                                <div className='grid gap-0'>
                                  <div className='font-medium text-blue-800'>
                                    Bar
                                  </div>
                                  <div className='font-semibold'>
                                    {data?.hotel.nr_bars}
                                  </div>
                                </div>
                              </li>
                            )}
                            {data?.hotel.nr_halls &&
                              data?.hotel.nr_halls > 0 && (
                                <li className='flex items-center gap-3 rounded border bg-gray-50 p-1 px-4'>
                                  <FaDoorOpen
                                    size={24}
                                    className='text-blue-700'
                                  />
                                  <div className='grid gap-0'>
                                    <div className='font-medium text-blue-800'>
                                      Salon
                                    </div>
                                    <div className='font-semibold'>
                                      {data?.hotel.nr_halls}
                                    </div>
                                  </div>
                                </li>
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className='mb-3 rounded bg-white p-3'>
                        <Spoiler
                          className='mb-5 pb-3'
                          maxHeight={120}
                          showLabel='Daha fazla göster'
                          hideLabel='Daha az göster'
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: description.hotelInformation.trim(),
                            }}
                          />
                        </Spoiler>
                      </div>
                    </div>
                    <Accordion className='grid gap-3 rounded bg-gray-50'>
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
                            <Accordion.Control className='flex w-full items-center gap-5 bg-white p-3 text-lg font-semibold'>
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
      </div>
    </>
  )
}

export { MainDrawer }
