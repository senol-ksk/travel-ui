import { Container, Title, Image, Button, ScrollArea } from '@mantine/core'
import NextImage from 'next/image'
import { headers } from 'next/headers'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { TourSearchEngine } from '@/modules/tour'
import {
  CmsContent,
  TourLandingParams,
  TourLandingWidget,
} from '@/types/cms-types'
import { Link } from 'next-view-transitions'
import dayjs from 'dayjs'

export default async function TourLandingPage() {
  const headersList = await headers()
  const domain = headersList.get('x-forwarded-host') || ''
  const protocol = headersList.get('x-forwarded-proto') || ''
  const baseUrl = `${protocol}://${domain}`

  const data = (
    await getContent<CmsContent<TourLandingWidget[], TourLandingParams>>(
      'tur/tur'
    )
  )?.data

  if (!data) return null
  const { params, widgets } = data
  const abroadTours = widgets?.filter((x) => x.point == 'abroad_tours')
  const abroadSeeAll = widgets?.find((x) => x.point == 'abroad_see_all')

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
          <Title c={'white'} pb={'md'}>
            {params.sub_title.value}
          </Title>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <TourSearchEngine />
          </div>
        </Container>
      </div>
      <Container className='flex flex-col gap-3 py-5 md:gap-7 md:py-10'>
        {abroadTours.length > 0 && (
          <div>
            <div className='flex justify-between gap-2 pb-3'>
              <Title order={2} fz={'h3'}>
                Ramazan Bayramı Turları
              </Title>
              {abroadSeeAll && (
                <div>
                  <Button
                    component={Link}
                    href={abroadSeeAll?.params.link.value}
                  >
                    {abroadSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
              <div className='flex gap-3'>
                {abroadTours.map((tour) => {
                  const url = new URL(tour.params.link.value, baseUrl)
                  const pathnames = url.pathname.split('/').filter(Boolean)
                  const checkinDate =
                    url.searchParams.get('checkinDate') ??
                    dayjs().add(10, 'D').format('YYYY-MM-DD')
                  const checkoutDate =
                    url.searchParams.get('checkoutDate') ??
                    dayjs(checkinDate).add(200, 'd').format('YYYY-MM-DD')

                  return (
                    <div key={tour.id} className='relative'>
                      <Link
                        href={`/tour/search-results?destinationSlug=${pathnames[1]}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}`}
                      >
                        <div className='relative size-[200px]'>
                          <Image
                            component={NextImage}
                            src={cdnImageUrl(tour.params.image.value)}
                            fill
                            alt={tour.title}
                            radius={'md'}
                          />
                        </div>
                        <div className='leading-lg absolute start-0 end-0 bottom-0 rounded-b bg-black/35 p-3 text-lg font-semibold text-white'>
                          {tour.title}
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </Container>
    </div>
  )
}
