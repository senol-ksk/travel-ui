import { HotelDetailDescription } from '@/app/hotel/types'
import { Accordion } from '@mantine/core'
import React from 'react'
import { FaSnowflake } from 'react-icons/fa'
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

type IProps = {
  descriptions: HotelDetailDescription
}

const FacilityProps: React.FC<IProps> = ({ descriptions }) => {
  const featureValues = Object.entries(descriptions)

  if (featureValues.length === 0) {
    return null
  }

  return (
    <>
      <div className='grid gap-3'>
        <div className='flex w-40 items-center justify-center rounded bg-white p-2 text-lg font-medium md:p-5'>
          <FaSnowflake className='mr-2 text-blue-500' /> Kış Sezonu
        </div>
        <Accordion className='grid gap-3 rounded'>
          {featureValues.map(([key, value], itemIndex) => {
            if (!value?.trim()) {
              return null
            }

            const title =
              titleTranslations[key as keyof typeof titleTranslations] || key
            return (
              <Accordion.Item
                key={itemIndex}
                value={String(itemIndex)}
                className='rounded bg-white shadow-sm md:p-3'
              >
                <Accordion.Control className='text-lg font-semibold'>
                  {title}
                </Accordion.Control>
                <Accordion.Panel>
                  <div
                    className='text-sm text-gray-700'
                    dangerouslySetInnerHTML={{ __html: value || '' }}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )
          })}
        </Accordion>
      </div>
    </>
  )
}

export { FacilityProps }
