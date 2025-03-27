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
import { LandingSliderItem } from './_components/landing-slider-item'

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

  const generateSearchURL = (link: string) => {
    const url = new URL(link, baseUrl)
    const pathnames = url.pathname.split('/').filter(Boolean)
    const checkinDate =
      url.searchParams.get('checkinDate') ??
      dayjs().add(10, 'D').format('YYYY-MM-DD')
    const checkoutDate =
      url.searchParams.get('checkoutDate') ??
      dayjs(checkinDate).add(200, 'd').format('YYYY-MM-DD')

    return `/tour/search-results?destinationSlug=${pathnames[1]}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}`
  }

  if (!data) return null
  const { params, widgets } = data
  const abroadTours = widgets?.filter((x) => x.point == 'abroad_tours')
  const abroadSeeAll = widgets?.find((x) => x.point == 'abroad_see_all')
  const aidTours = widgets?.filter((x) => x.point == 'aid_tours')
  const aidTitle = widgets?.find((x) => x.point == 'aid_title')
  const aidSeeAll = widgets?.find((x) => x.point == 'aid_see_all')
  const shipTours = widgets?.filter((x) => x.point == 'ship_tours')
  const shipSeeAll = widgets?.find((x) => x.point == 'ship_see_all')

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
            <div className='flex items-center justify-between gap-2 pb-3'>
              <Title order={2} fz={'h3'}>
                Ramazan Bayramı Turları
              </Title>
              {abroadSeeAll && (
                <div>
                  <Button
                    component={Link}
                    href={generateSearchURL(abroadSeeAll?.params.link.value)}
                  >
                    {abroadSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
              <div className='flex gap-3'>
                {abroadTours.map((tour) => {
                  return (
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                      key={tour.id}
                    />
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}
        {aidTours.length > 0 && (
          <div>
            <div className='flex items-center justify-between gap-2 pb-3'>
              <Title order={3} fz={'h3'}>
                {aidTitle?.title}
              </Title>
              {aidSeeAll && (
                <div>
                  <Button
                    component={Link}
                    href={generateSearchURL(aidSeeAll?.params.link.value)}
                  >
                    {abroadSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
              <div className='flex gap-3'>
                {aidTours.map((tour) => {
                  return (
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                      key={tour.id}
                    />
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        )}
        {shipTours.length > 0 && (
          <div>
            <div className='flex items-center justify-between gap-2 pb-3'>
              <Title order={3} fz={'h3'}>
                Gemi Turları
              </Title>
              {shipSeeAll && (
                <div>
                  <Button
                    component={Link}
                    href={generateSearchURL(shipSeeAll?.params.link.value)}
                  >
                    {shipSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
              <div className='flex gap-3'>
                {shipTours.map((tour) => {
                  return (
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                      key={tour.id}
                    />
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
