import NextImage from 'next/image'
import { Container, Image, rem, Title } from '@mantine/core'
import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { Flight } from '@/modules/flight'
import {
  CmsContent,
  FlightLandingParams,
  FlightLandingWidget,
} from '@/types/cms-types'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function FlightLandingDetail({ params }: PageProps) {
  const { slug } = await params

  const data = (
    await getContent<CmsContent<FlightLandingWidget[], FlightLandingParams>>(
      `ucak-bileti/${slug}`
    )
  )?.data

  if (!data) return notFound()

  const { params: cmsParams, widgets } = data
  const teaser = widgets
    .filter((item) => item.point === 'teaser')
    .sort((a, b) => (a.ordering ?? 0) - (b.ordering ?? 0))
  const domesticCheapFlight = widgets.filter(
    (item) => item.point === 'cheap_domestic_cities'
  )
  const domesticTitle = widgets.find(
    (item) => item.point === 'cheap_domestic_title1'
  )

  return (
    <div>
      <div className='relative border-b py-5 shadow-xs md:py-9'>
        <Image
          component={NextImage}
          src={cdnImageUrl(cmsParams?.image.value)}
          fill
          priority={false}
          alt={cmsParams.sub_title.value}
          className='z-0'
        />
        <Container className='relative z-10'>
          {cmsParams.sub_title.value && (
            <Title fz={'h2'} pb={rem(20)}>
              {cmsParams.sub_title.value}
            </Title>
          )}
          <div className='rounded-md bg-white p-3 md:p-5'>
            <Flight />
          </div>
        </Container>
      </div>
      <Container className='py-10'>
        <div className='grid grid-cols-1 justify-stretch gap-2 md:grid-cols-3 md:gap-4'>
          {teaser.map((teaserItem) => (
            <div key={teaserItem.id} className='rounded border p-3'>
              {teaserItem.title}
            </div>
          ))}
        </div>
        {domesticTitle && (
          <div className='pt-3'>
            <Title order={2} fz={'h4'}>
              {domesticTitle.title}
            </Title>
            {domesticCheapFlight.map((flight) => {
              return (
                <div key={flight.id}>
                  <div className='relative size-[30px]'>
                    <Image
                      component={NextImage}
                      src={cdnImageUrl(flight.params.image.value)}
                      alt={flight.title}
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>{flight.title}</div>
                  <div>{flight.params.search_date?.value}</div>
                  <div>{flight.params.sort_desc?.value}</div>
                </div>
              )
            })}
          </div>
        )}
        <div>
          <div dangerouslySetInnerHTML={{ __html: cmsParams.content.value }} />
        </div>
      </Container>
    </div>
  )
}
