import {
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
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Title fz='h2'>{data.package.title}</Title>

        <div className='grid gap-3'>
          <div className='flex items-center gap-4'>
            <div className='text-blue-800'>
              <IoCalendarClearOutline size={20} />
            </div>
            <div className='font-semibold'>
              {dayjsStartDate.format("DD MMM'YY")}
              {' - '}
              {dayjsEndDate.format("DD MMM'YY")} arası 
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-blue-800'>
              <BiMoon size={20} />
            </div>
            <div className='font-semibold'>
              {totalNights} gece {totalDays} gün
            </div>
          </div>
          {data.detail.flightInformation &&
            data.detail.flightInformation.length && (
              <div className='flex items-center gap-4'>
                <div className='text-blue-800'>
                  <IoIosAirplane size={20} />
                </div>
                <div className='font-semibold'>
                  {data.detail.flightInformation.at(0)}
                </div>
              </div>
            )}
        </div>
        <div className='text-dark-200 text-xs'>
          Not : Çocuk kategorisi 7-12 yaşları arasıdır. Tur sirküsü yayımlandığı
          03.02.2025 tarihinde geçerlidir. Aynı tura ait, daha sonraki bir
          tarihte yayımlanacak tur sirküsü bir öncekini geçersiz kılar. Zorunlu
          ek hizmetler fiyata dahildir.
        </div>
      </div>

      <Title order={2} fz={{ base: 'h4', md: 'h2' }} px={{ base: 'md', md: 0 }}>
        Tur Programı
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Spoiler
          maxHeight={200}
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
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
      <Title order={2} fz={{ base: 'h4', md: 'h2' }} px={{ base: 'md', md: 0 }}>
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

      <Title order={2} fz={{ base: 'h4', md: 'h2' }} px={{ base: 'md', md: 0 }}>
        Dahil Olan Hizmetler
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Spoiler
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
          maxHeight={120}
          classNames={{
            root: 'pb-3',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: data.detail.includedInformation,
            }}
          />
        </Spoiler>
      </div>
      <Title order={2} fz={{ base: 'h4', md: 'h2' }} px={{ base: 'md', md: 0 }}>
        Dahil Olmayan Hizmetler
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Spoiler
          maxHeight={120}
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
          classNames={{
            root: 'pb-3',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: data.detail.notIncludedInformation,
            }}
          />
        </Spoiler>
      </div>
    </div>
  )
}

export { TourDetail }
