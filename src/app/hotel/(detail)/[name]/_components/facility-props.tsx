import { HotelDetailDescription } from '@/app/hotel/types'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import { Accordion } from '@mantine/core'
import React, { JSX } from 'react'
import { GeneralDrawer } from './general-drawer'
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
import { CiForkAndKnife } from 'react-icons/ci'
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

type IProps = {
  descriptions: HotelDetailDescription
  data: HotelDetailResponseHotelInfo | undefined
  onOpenDrawer: () => void
}

const FacilityProps: React.FC<IProps> = ({
  descriptions,
  data,
  onOpenDrawer,
}) => {
  const featureValues = Object.entries(descriptions)
  const hotelInfos = Object.entries(data ?? {})
  const mealType = data?.hotel.meal_type
  const foodDrinks = data?.hotel.food_drinks
  const groupedBySeason = foodDrinks?.reduce(
    (acc: Record<string, typeof foodDrinks>, item) => {
      if (!acc[item.season]) acc[item.season] = []
      acc[item.season].push(item)
      return acc
    },
    {}
  ) //thanks ai

  if (featureValues.length === 0 || hotelInfos.length === 0) return null

  return (
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

      <GeneralDrawer
        description={descriptions}
        data={data}
        onOpenDrawer={onOpenDrawer}
      />

      <Accordion className='grid gap-3 rounded'>
        {featureValues.map(([key, value], itemIndex) => {
          if (!value?.trim()) return null

          const title =
            titleTranslations[key as keyof typeof titleTranslations] || key
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
                <div dangerouslySetInnerHTML={{ __html: value || '' }} />
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
      <Accordion multiple>
        <Accordion.Item
          value='otel-konsepti'
          className='rounded bg-white shadow-sm'
        >
          <Accordion.Control className='flex w-full items-center gap-5 bg-white p-3 text-lg font-semibold'>
            <div className='flex items-center gap-3'>
              <CiForkAndKnife />
              <div> Otel Konsepti</div>
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            {mealType && (
              <div className='mb-3 text-lg font-medium text-blue-600'>
                {mealType}
              </div>
            )}

            {groupedBySeason &&
              Object.entries(groupedBySeason).map(([season, seasonItems]) => {
                const groupedByArea = seasonItems.reduce(
                  (acc: Record<string, typeof seasonItems>, item) => {
                    if (!acc[item.area]) acc[item.area] = []
                    acc[item.area].push(item)
                    return acc
                  },
                  {}
                )

                return (
                  <div key={season} className='mb-5'>
                    {/* <h3 className='text-md mb-2 font-semibold text-blue-500'>
                      {season}
                    </h3> */}

                    {Object.entries(groupedByArea).map(([area, areaItems]) => (
                      <div key={area} className='mb-4'>
                        <div className='my-4 text-xl font-semibold text-gray-800'>
                          {area}
                        </div>
                        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                          {Object.entries(
                            areaItems.reduce(
                              (acc: Record<string, typeof areaItems>, item) => {
                                if (!acc[item.service]) acc[item.service] = []
                                acc[item.service].push(item)
                                return acc
                              },
                              {}
                            )
                          ).map(([service, serviceItems]) => (
                            <div
                              key={service}
                              className='rounded border bg-gray-50 p-3 py-5'
                            >
                              <div className='text-center font-bold text-blue-600'>
                                {service}
                              </div>
                              <div className='text-center text-sm text-gray-800'>
                                {serviceItems
                                  .map((s) => `${s.start_time} - ${s.end_time}`)
                                  .join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export { FacilityProps }
