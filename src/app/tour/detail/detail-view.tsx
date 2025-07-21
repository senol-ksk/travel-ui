import {
  Accordion,
  Divider,
  Spoiler,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import dayjs from 'dayjs'
import { IoCalendarClearOutline } from 'react-icons/io5'

import { TourDetailApiResponse } from '@/modules/tour/type'
import { BiMoon } from 'react-icons/bi'
import { IoIosAirplane } from 'react-icons/io'
import { MdOutlineLocalHotel } from 'react-icons/md'
import { FaRegCheckCircle } from 'react-icons/fa'
import { GoNoEntry } from 'react-icons/go'
// import { TourPassengers } from '../_components/tour-passengers'

type Props = {
  data: TourDetailApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => {
  const { startDate, endDate } = data.package
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1

  return (
    <div className='flex flex-col gap-6'>
      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='tour-program'
      >
        Tur Programı
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Spoiler
          maxHeight={200}
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Devamını Göster'}
          classNames={{
            root: 'pb-3',
          }}
        >
          <div className='flex flex-col gap-6'>
            {data.detail.tourProgram.map((tourProgram, tourProgramIndex) => (
              <div key={tourProgramIndex}>
                <Title order={4} fz={{ base: 'md' }} c={'blue.8'} pb='md'>
                  {tourProgram.title}
                </Title>
                <TypographyStylesProvider fz={'sm'} lh={'sm'}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tourProgram.description,
                    }}
                  />
                </TypographyStylesProvider>
              </div>
            ))}
          </div>
        </Spoiler>
      </div>
      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='transport'
      >
        Ulaşım Bilgisi
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        {data.detail.flightInformation &&
          data.detail.flightInformation.length && (
            <>
              <div className='flex items-center gap-3 text-lg font-semibold'>
                <div>
                  <IoIosAirplane size={20} />
                </div>
                <div>Ulaşım Bilgisi</div>
              </div>
              <Divider />
              <div className='grid gap-4'>
                {data.detail.flightInformation.map((flight, flightIndex) => (
                  <div key={flightIndex}>
                    <div dangerouslySetInnerHTML={{ __html: flight }} />
                  </div>
                ))}
              </div>
            </>
          )}

        <div className='flex items-center gap-3 text-lg font-semibold'>
          <div>
            <MdOutlineLocalHotel size={20} />
          </div>
          <div>Otel Bilgisi</div>
        </div>
        <Divider />
        <div>
          {data.package.hotelInformations &&
            data.package.hotelInformations.map((hotel, hotelIndex) => (
              <div key={hotelIndex}>{hotel.name}</div>
            ))}
        </div>
      </div>

      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='inclued'
      >
        Genel Bilgiler
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border px-3 pt-3 shadow-sm'>
        <div className='flex items-center gap-3 border-b p-3'>
          <FaRegCheckCircle />
          <span className='text-lg font-semibold'>
            Ücrete Dahil Olan Hizmetler
          </span>
        </div>
        {/* burası değieşcek vize faşan gelcek  */}
        <Spoiler
          maxHeight={100}
          hideLabel={<div className='px-3'>Daha Az Görüntüle</div>}
          showLabel={<div className='px-3'>Devamını Göster</div>}
          className='px-3'
        >
          <div
            className='font-medium'
            dangerouslySetInnerHTML={{
              __html: data.detail.includedInformation,
            }}
          />
        </Spoiler>
        <Accordion
          defaultValue='included'
          multiple={false}
          variant='default'
          className='mb-5 rounded-md border shadow-sm'
        >
          <Accordion.Item value='included' className='px-3 py-2'>
            <Accordion.Control>
              <span className='text-xl font-semibold'>
                Dahil Olan Hizmetler
              </span>
            </Accordion.Control>
            <Spoiler
              maxHeight={200}
              hideLabel={'Daha Az Görüntüle'}
              showLabel={'Devamını Göster'}
            >
              <Accordion.Panel>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.detail.includedInformation,
                  }}
                />
              </Accordion.Panel>
            </Spoiler>
          </Accordion.Item>

          <Accordion.Item value='not-included' className='px-3 py-2'>
            <Accordion.Control>
              <div className='flex items-center gap-3'>
                <GoNoEntry size={22} />
                <span className='text-xl font-semibold'>
                  Ücrete Dahil Olmayan Hizmetler & Önemli Notlar
                </span>
              </div>
            </Accordion.Control>
            <Spoiler
              maxHeight={100}
              hideLabel={'Daha Az Görüntüle'}
              showLabel={'Devamını Göster'}
            >
              <Accordion.Panel>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.detail.notIncludedInformation,
                  }}
                />
              </Accordion.Panel>
            </Spoiler>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )
}

export { TourDetail }
