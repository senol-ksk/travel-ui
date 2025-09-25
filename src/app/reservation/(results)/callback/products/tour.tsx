import { Spoiler } from '@mantine/core'
import dayjs from 'dayjs'

import { TourSummaryResponse } from '@/app/reservation/types'
import { CheckoutCard } from '@/components/card'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: TourSummaryResponse
  passengerCount?: number
}

const TourSummary: React.FC<IProps> = ({ data, passengerCount }) => {
  const { package: tourPackage } = data
  return (
    <>
      <Link
        href={`${process.env.SITE_URL}/kampanyalar?categoryId=233`}
        target='_blank'
      >
        <Img
          height={200}
          className='mb-3 w-auto'
          src='https://ykmturizm.mncdn.com/11/Files/638935150943482316.png'
        />
      </Link>
      <CheckoutCard title='Tur Bilgisi'>
        <div className='grid gap-4 md:grid-cols-6 md:gap-3'>
          <div className='md:col-span-2'>
            <Img
              width={310}
              height={200}
              src={tourPackage.imageUrl}
              alt={tourPackage.title}
              className='w-full rounded-lg'
            />
          </div>
          <div className='md:col-span-4'>
            <strong className='text-lg'>{tourPackage.title}</strong>
            <div className='mt-1 text-gray-600'>{tourPackage.description}</div>

            <div className='mt-2 space-y-1'>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Başlangıç</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(tourPackage.startDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Bitiş</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(tourPackage.endDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Süre</div>
                <div>:</div>
                <div className='text-sm'>{tourPackage.tourTime} Gün</div>
              </div>
              {tourPackage.cities &&
                tourPackage.cities.length > 0 &&
                tourPackage.cities.some((city) => city && city.title) && (
                  <div className='flex items-center gap-2'>
                    <div className='w-24 text-sm font-medium'>Şehirler</div>
                    <div>:</div>
                    <div className='text-sm'>
                      {tourPackage.cities
                        .filter((city) => city && city.title)
                        .map((city) => city.title)
                        .join(', ')}
                    </div>
                  </div>
                )}
              {tourPackage.group && tourPackage.group.title && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Grup</div>
                  <div>:</div>
                  <div className='text-sm'>{tourPackage.group.title}</div>
                </div>
              )}
              {tourPackage.region && tourPackage.region.title && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Bölge</div>
                  <div>:</div>
                  <div className='text-sm'>{tourPackage.region.title}</div>
                </div>
              )}
              {passengerCount && passengerCount > 0 && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Misafirler</div>
                  <div>:</div>
                  <div className='text-sm'>{passengerCount} Kişi</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CheckoutCard>
      {tourPackage.detail?.flightInformation &&
        tourPackage.detail.flightInformation.length > 0 &&
        tourPackage.detail.flightInformation.some(
          (info) => info && info.trim()
        ) && (
          <div className='pb-3'>
            <CheckoutCard title='Ulaşım Bilgileri'>
              <div className='space-y-2'>
                {tourPackage.detail.flightInformation
                  .filter((info) => info && info.trim())
                  .map((flight, index) => (
                    <div key={index} className='text-sm text-gray-700'>
                      {flight}
                    </div>
                  ))}
              </div>
            </CheckoutCard>
          </div>
        )}
      {tourPackage.hotelInformations &&
        tourPackage.hotelInformations.length > 0 &&
        tourPackage.hotelInformations.some(
          (hotel) => hotel && hotel.name && hotel.name.trim()
        ) && (
          <div className='pb-3'>
            <CheckoutCard title='Konaklama Bilgileri'>
              <div className='space-y-3'>
                {tourPackage.hotelInformations
                  .filter((hotel) => hotel && hotel.name && hotel.name.trim())
                  .map((hotel, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-3 rounded-lg bg-gray-50 p-3'
                    >
                      <div className='flex-1'>
                        <div className='font-medium'>{hotel.name}</div>
                        <div className='text-sm text-gray-600'>
                          {hotel.rating} Yıldızlı Otel
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CheckoutCard>
          </div>
        )}
      {tourPackage.detail?.includedInformation &&
        tourPackage.detail.includedInformation.trim() && (
          <div className='py-3'>
            <CheckoutCard title='Dahil Olan Hizmetler'>
              <Spoiler
                maxHeight={200}
                showLabel='Daha fazla göster'
                hideLabel='Daha az göster'
                styles={{
                  control: {
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '12px',
                  },
                }}
              >
                <div
                  className='text-sm leading-relaxed text-gray-700'
                  dangerouslySetInnerHTML={{
                    __html: tourPackage.detail.includedInformation,
                  }}
                />
              </Spoiler>
            </CheckoutCard>
          </div>
        )}
      {tourPackage.detail?.notIncludedInformation &&
        tourPackage.detail.notIncludedInformation.trim() && (
          <div className='pb-5'>
            <CheckoutCard title='Dahil Olmayan Hizmetler'>
              <Spoiler
                maxHeight={200}
                showLabel='Daha fazla göster'
                hideLabel='Daha az göster'
                styles={{
                  control: {
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '12px',
                  },
                }}
              >
                <div
                  className='text-sm leading-relaxed text-gray-700'
                  dangerouslySetInnerHTML={{
                    __html: tourPackage.detail.notIncludedInformation,
                  }}
                />
              </Spoiler>
            </CheckoutCard>
          </div>
        )}
      {tourPackage.detail?.tourProgram &&
        tourPackage.detail.tourProgram.length > 0 &&
        tourPackage.detail.tourProgram.some(
          (program) => program && (program.title || program.description)
        ) && (
          <div className='pb-3'>
            <CheckoutCard title='Tur Programı'>
              <Spoiler
                maxHeight={400}
                showLabel='Daha fazla göster'
                hideLabel='Daha az göster'
                styles={{
                  control: {
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '14px',
                    marginTop: '12px',
                  },
                }}
              >
                <div className='space-y-4'>
                  {tourPackage.detail.tourProgram
                    .filter(
                      (program) =>
                        program && (program.title || program.description)
                    )
                    .map((program, index) => (
                      <div
                        key={index}
                        className='border-l-4 border-blue-500 pl-4'
                      >
                        {program.title && (
                          <h4 className='mb-2 text-lg font-semibold'>
                            {program.title}
                          </h4>
                        )}
                        {program.description && (
                          <div
                            className='text-sm leading-relaxed text-gray-700'
                            dangerouslySetInnerHTML={{
                              __html: program.description,
                            }}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </Spoiler>
            </CheckoutCard>
          </div>
        )}
    </>
  )
}

export { TourSummary }
