import { Container, Title, Image, ScrollArea } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import {
  CarLandingParams,
  CarLandingWidget,
  CmsContent,
} from '@/types/cms-types'

export default async function CarLandingPage() {
  const data = (
    await getContent<CmsContent<CarLandingWidget[], CarLandingParams>>(
      'arac/arac'
    )
  )?.data

  if (!data) return null

  const { params, widgets } = data
  const providers = widgets.find((item) => item.point === 'providers')
  const popularDomesticLocations = widgets.filter(
    (item) => item.point === 'popular_domestic_locations'
  )
  const popularLocationsAbroad = widgets.filter(
    (item) => item.point === 'popular_locations_abroad'
  )

  return (
    <div className='py-6 md:py-10'>
      <Container className='flex flex-col gap-3 md:gap-5'>
        <div>
          <Title order={2} fz={'h3'} className='pb-3 text-center'>
            {providers?.title}
          </Title>
          <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
            <div className='flex gap-3'>
              {providers?.params.images.list.map(
                (providerImageUrl, provideIndex) => {
                  return (
                    <div key={provideIndex} className='rounded-lg border p-2'>
                      <div className='relative h-[48] w-[106px]'>
                        <Image
                          fill
                          component={NextImage}
                          priority={false}
                          src={cdnImageUrl(providerImageUrl)}
                          alt=''
                          objectFit='cover'
                        />
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </ScrollArea>
        </div>
        <div>
          <Title order={3} className='text-center'>
            Popüler araç kiralama noktaları
          </Title>
        </div>
        <div>
          <Title order={4}>Yurt İçi Araç Kiralama Noktaları</Title>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {popularDomesticLocations.map((item) => (
              <div key={item.id} className='relative h-36'>
                <Image
                  radius={'md'}
                  component={NextImage}
                  src={cdnImageUrl(item.params.image.value)}
                  fill
                  alt={item.title}
                />
                <div className='absolute bottom-0 z-10 p-4 text-lg font-semibold text-white'>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Title order={4}>Yurt Dışı Araç Kiralama Noktaları</Title>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
            {popularLocationsAbroad.map((item) => (
              <div key={item.id} className='relative h-36'>
                <Image
                  radius={'md'}
                  component={NextImage}
                  src={cdnImageUrl(item.params.image.value)}
                  fill
                  alt={item.title}
                />
                <div className='absolute bottom-0 z-10 p-4 text-lg font-semibold text-white'>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
