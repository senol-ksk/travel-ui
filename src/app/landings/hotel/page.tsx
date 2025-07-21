import { Container, Title, Image, Box, ScrollArea, Button } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { HotelSearchEngine } from '@/modules/hotel'
import {
  CmsContent,
  HotelLandingParams,
  HotelLandingWidgets,
} from '@/types/cms-types'
import { Link } from 'next-view-transitions'
import { HotelDeals } from '@/app/hotel/_components/deals'
// import { HotelDeals } from './_components/deals'

export default async function HotelLandingPage() {
  const data = (
    await getContent<CmsContent<HotelLandingWidgets[], HotelLandingParams>>(
      'otel/otel'
    )
  )?.data

  if (!data) return null
  const { params, widgets } = data

  const teaser = widgets
    .filter((item) => item.point === 'teaser')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))

  const themes = widgets
    .filter((item) => item.point === 'theme')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))

  const deals = widgets
    .filter((item) => item.point === 'hotel_deals')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))
  const popularPlaces = widgets
    .filter((item) => item.point === 'popular_places')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))

  return (
    <div>
      <div className='relative border-b py-4'>
        <Image
          component={NextImage}
          src={cdnImageUrl(params?.image.value)}
          fill
          priority={true}
          alt={params.sub_title.value}
          className='z-0'
        />
        <Container className='relative z-10'>
          <Title fz={'h2'} pb={'md'} c={'white'}>
            {params.sub_title.value}
          </Title>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <HotelSearchEngine />
          </div>
        </Container>
      </div>
      <Container className='flex flex-col gap-3 py-5 md:gap-7 md:py-10'>
        <div className='py-4 md:py-7'>
          <div className='grid grid-cols-1 justify-stretch gap-2 sm:grid-cols-3 md:gap-4'>
            {teaser.map((teaserItem) => (
              <Box
                key={teaserItem.id}
                component={Link}
                href={teaserItem.params.link.value}
              >
                <div className='rounded border p-3'>{teaserItem.title}</div>
              </Box>
            ))}
          </div>
        </div>
        <div>
          <Title order={2} className='text-center'>
            Her İhtiyaca Uygun Tatil Seçenekleri
          </Title>
          {themes.length > 0 && (
            <div className='py-3'>
              <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
                <div className='flex gap-3'>
                  {themes.map((theme) => {
                    return (
                      <div key={theme.id}>
                        <Button
                          component={Link}
                          href={theme.params.link.value}
                          size='compact-sm'
                        >
                          {theme.title}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
        {deals.length > 0 && (
          <div>
            <Title order={3} pb={'lg'} className='text-center'>
              Erken Rezervasyon Fırsatları
            </Title>
            <HotelDeals widgets={deals} />
          </div>
        )}
        {popularPlaces.length > 0 && (
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4'>
            {popularPlaces.map((item) => (
              <Box
                component={Link}
                href={item.params.link.value}
                key={item.id}
                className='rounded border p-3'
              >
                {item.title}
              </Box>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
