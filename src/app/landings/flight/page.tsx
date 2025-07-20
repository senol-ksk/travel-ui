import { Image, Container, rem, Title, Box } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { Flight } from '@/modules/flight/'
import {
  CmsContent,
  FlightLandingParams,
  FlightLandingWidget,
} from '@/types/cms-types'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'

export default async function FlightLandingPage() {
  const data = (
    await getContent<CmsContent<FlightLandingWidget[], FlightLandingParams>>(
      'ucak-bileti/ucak-bileti'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data
  const teaser = widgets
    .filter((item) => item.point === 'teaser')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))

  const popularDomesticFlights = widgets.filter(
    (widget) => widget.point === 'popular_domestic_flights'
  )
  const popularInternationalFlights = widgets.filter(
    (widget) => widget.point === 'popular_international_flights'
  )

  return (
    <>
      <div className='relative border-b py-5 shadow-xs md:py-9'>
        <Image
          component={NextImage}
          src={cdnImageUrl(params?.image.value)}
          fill
          priority={false}
          alt={params.sub_title.value}
          className='z-0'
        />
        <Container className='relative z-10'>
          <Title fz={'h2'} pb={rem(20)}>
            {params?.sub_title.value}
          </Title>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <Flight />
          </div>
        </Container>
      </div>
      <Container className='py-10'>
        <div className='grid gap-4'>
          <div className='grid grid-cols-1 justify-stretch gap-2 md:grid-cols-3 md:gap-4'>
            {teaser.map((teaserItem) => (
              <div key={teaserItem.id} className='rounded border p-3'>
                {teaserItem.title}
              </div>
            ))}
          </div>
          {widgets
            .filter((widget) => widget.point === 'top_content')
            .map((widget) => (
              <div key={widget.id}>
                <article>
                  <Title order={3}>{widget.title}</Title>
                  <div>
                    <div>{widget.params.sort_desc?.value}</div>
                  </div>
                </article>
              </div>
            ))}
          <div className='grid gap-4'>
            <Title order={2} className='text-center'>
              Popüler Uçuşlar
            </Title>

            {popularDomesticFlights.length > 0 && (
              <div>
                <Title order={4}>Yurt İçi Popüler Uçuşlar</Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularDomesticFlights.map((flight) => (
                    <Box
                      component={Link}
                      href={`/ucak-bileti/${flight.params.destinations.destinations
                        .map((item) => item.slug)
                        .join('-')}`}
                      key={flight.id}
                      className='rounded border p-3'
                    >
                      <div>{flight.title}</div>
                      <div>{flight.params.sort_desc?.value}</div>
                    </Box>
                  ))}
                </div>
              </div>
            )}
            {popularInternationalFlights.length > 0 && (
              <div>
                <Title order={4}>Yurt Dışı Popüler Uçuşlar</Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularInternationalFlights.map((flight) => (
                    <Box
                      component={Link}
                      href={`/ucak-bileti/${flight.params.destinations.destinations
                        .map((item) => item.slug)
                        .join('-')}`}
                      key={flight.id}
                      className='rounded border p-3'
                    >
                      <div>{flight.title}</div>
                      <div>{flight.params.sort_desc?.value}</div>
                    </Box>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
