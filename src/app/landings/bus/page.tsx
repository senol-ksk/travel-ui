import { Box, Container, Title, Image } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { BusSearchEngine } from '@/modules/bus'
import {
  BusLandingParams,
  BusLandingWidgets,
  CmsContent,
} from '@/types/cms-types'

export default async function BusLandingPage() {
  const data = (
    await getContent<CmsContent<BusLandingWidgets[], BusLandingParams>>(
      'otobus/otobus'
    )
  )?.data

  if (!data) return null

  const { params, widgets } = data
  const teaser = widgets.filter((item) => item.point === 'teaser')
  const popularBusServices = widgets.filter(
    (item) => item.point === 'popular_bus_services'
  )

  return (
    <div>
      <div className='border-b py-5'>
        <Container>
          <Title fz={'h2'} pb={'md'}>
            {params.sub_title.value}
          </Title>
          <BusSearchEngine />
        </Container>
      </div>
      <div className='py-5 md:py-9'>
        <Container className='flex flex-col gap-3 md:gap-6'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {teaser.map((tease) => (
              <div key={tease.id} className='rounded border p-3'>
                {tease.title}
              </div>
            ))}
          </div>
          {popularBusServices.length > 0 && (
            <div>
              <Title order={2} fz={'h3'}>
                Populer Otobüs Seferleri
              </Title>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4'>
                {popularBusServices.map((bus) => (
                  <Box key={bus.id} className='relative h-[200px]'>
                    <Image
                      component={NextImage}
                      fill
                      src={cdnImageUrl(bus.params.image.value)}
                      alt=''
                      className='z-0 rounded-lg'
                    />

                    <div className='absolute bottom-0 z-10 p-3 text-lg font-semibold text-white'>
                      {bus.title}
                    </div>
                  </Box>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}
