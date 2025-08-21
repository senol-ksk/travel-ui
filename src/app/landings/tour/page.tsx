import {
  Container,
  Title,
  Image,
  Button,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from '@mantine/core'
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

import { serializeTourSearchParams } from '@/modules/tour/searchResultParams'
import { LandingSliderItem } from '@/app/tour/_components/landing-slider-item'
import { notFound } from 'next/navigation'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Route } from 'next'

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
    const destinationSlug = url.pathname.split('/').filter(Boolean).at(-1)
    const checkinDate = dayjs().add(1, 'day').toDate()
    const checkoutDate = dayjs(checkinDate).add(1, 'years').toDate()

    const serializedUrl = serializeTourSearchParams('/tour/search-results', {
      checkinDate,
      checkoutDate,
      destinationSlug,
    }) as Route

    return serializedUrl
  }

  if (!data) return notFound()

  const { params, widgets } = data
  const abroadTours = widgets?.filter((x) => x.point == 'abroad_tours')
  const abroadSeeAll = widgets?.find((x) => x.point == 'abroad_see_all')
  const aidTours = widgets?.filter((x) => x.point == 'aid_tours')
  const aidTitle = widgets?.find((x) => x.point == 'aid_title')
  const aidSeeAll = widgets?.find((x) => x.point == 'aid_see_all')
  const shipTours = widgets?.filter((x) => x.point == 'ship_tours')
  const shipSeeAll = widgets?.find((x) => x.point == 'ship_see_all')
  const faqs = widgets?.filter((x) => x.point == 'sss')
  const europe_tours = widgets?.filter((x) => x.point == 'europe_tours')
  const teasers = widgets?.filter(
    (x) =>
      x.point !== 'europe_tours' &&
      x.point !== 'abroad_tours' &&
      x.point !== 'sss'
  )

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
      <Container className='grid grid-cols-1 gap-8 py-5 md:gap-12 md:py-10'>
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
                    size='compact-sm'
                  >
                    {abroadSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <Carousel slideSize={'auto'} slideGap={'lg'}>
              {abroadTours.map((tour) => {
                return (
                  <CarouselSlide key={tour.id}>
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                    />
                  </CarouselSlide>
                )
              })}
            </Carousel>
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
                    size='compact-sm'
                  >
                    {abroadSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>

            <Carousel slideSize={'auto'} slideGap={'lg'}>
              {aidTours.map((tour) => {
                return (
                  <CarouselSlide key={tour.id}>
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                    />
                  </CarouselSlide>
                )
              })}
            </Carousel>
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
                    size='compact-sm'
                  >
                    {shipSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <Carousel slideSize={'auto'} slideGap={'lg'}>
              {shipTours.map((tour) => {
                return (
                  <CarouselSlide key={tour.id}>
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                    />
                  </CarouselSlide>
                )
              })}
            </Carousel>
          </div>
        )}
        {europe_tours.length > 0 && (
          <div>
            <div className='flex items-center justify-between gap-2 pb-3'>
              <Title order={3} fz={'h3'}>
                Avrupa Turları
              </Title>
              {shipSeeAll && (
                <div>
                  <Button
                    component={Link}
                    href={generateSearchURL(shipSeeAll?.params.link.value)}
                    size='compact-sm'
                  >
                    {shipSeeAll?.title}
                  </Button>
                </div>
              )}
            </div>
            <Carousel slideSize={'auto'} slideGap={'lg'}>
              {europe_tours.map((tour) => {
                return (
                  <CarouselSlide key={tour.id}>
                    <LandingSliderItem
                      href={generateSearchURL(tour.params.link.value)}
                      imageSrc={cdnImageUrl(tour.params.image.value)}
                      title={tour.title}
                    />
                  </CarouselSlide>
                )
              })}
            </Carousel>
          </div>
        )}
        {faqs?.length > 0 && (
          <div>
            <Title order={2} mb={'lg'} fz={'h3'}>
              Sıkça Sorulan Sorular
            </Title>
            <Accordion chevronPosition='right' variant='contained' radius='md'>
              {faqs.map((faq) => {
                return (
                  <AccordionItem key={faq.id} value={faq.title}>
                    <AccordionControl
                      classNames={{
                        label: 'font-medium py-2 md:py-6',
                      }}
                    >
                      {faq.title}
                    </AccordionControl>
                    <AccordionPanel>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: faq.params.description.value,
                        }}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}
      </Container>
    </div>
  )
}
