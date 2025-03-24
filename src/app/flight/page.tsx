import { Image, Container, rem, Title, Button } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { Flight } from '@/modules/flight/'
import { CmsContent } from '@/types/cms-types'

type FlightLandingWidget = {
  id: ID
  title: string
  typeId: ID
  collectionId: ID
  point: string
  params: {
    sort_description: {
      value: string
    }
    description: {
      value: string
    }
    btn_text: {
      value: ''
    }
    link: {
      value: ''
    }

    view_country: {
      value: string
    }
    destinations: {
      destinations: {
        id: ID
        name: string
        slug: string
        code: string | null
        iata: null
        typeId: ID
        domestic: boolean
      }[]
      value: ''
    }
    image: {
      value: string
    }
    sort_desc: {
      value: string
    }
    icon: {
      value: ''
    }
    search_date: {
      value: ''
    }
    svg: {
      value: string
    }
  }
  ordering: null | number
  language: string
  active: boolean
}

type FlightLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

export default async function FlightLandingPage() {
  const data = (
    await getContent<CmsContent<FlightLandingWidget[], FlightLandingParams>>(
      'ucak-bileti/ucak-bileti'
    )
  )?.data

  if (!data) return null

  const params = data?.params
  const widgets = data?.widgets
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
                    <div key={flight.id} className='rounded border p-3'>
                      <div>{flight.title}</div>
                      <div>{flight.params.sort_desc?.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {popularInternationalFlights.length > 0 && (
              <div>
                <Title order={4}>Yurt Dışı Popüler Uçuşlar</Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularInternationalFlights.map((flight) => (
                    <div key={flight.id} className='rounded border p-3'>
                      <div>{flight.title}</div>
                      <div>{flight.params.sort_desc?.value}</div>
                    </div>
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
