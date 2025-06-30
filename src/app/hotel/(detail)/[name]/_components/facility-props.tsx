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
                <div dangerouslySetInnerHTML={{ __html: value || '' }} />
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}

export { FacilityProps }
