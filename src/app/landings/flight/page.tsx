import {
  Image,
  Container,
  rem,
  Title,
  Box,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  ScrollArea,
  AspectRatio,
  Typography,
} from '@mantine/core'
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
import ProductBox from '../_components/box-link'
import { Route } from 'next'

export default async function FlightLandingPage() {
  const data = (
    await getContent<CmsContent<FlightLandingWidget[], FlightLandingParams>>(
      'ucak-bileti/ucak-bileti'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data
  const popularDomesticFlights = widgets.filter(
    (widget) => widget.point === 'popular_domestic_flights'
  )
  const popularInternationalFlights = widgets.filter(
    (widget) => widget.point === 'popular_international_flights'
  )
  const faqs = widgets.filter((widget) => widget.point === 'sss')
  const popular_airlines = widgets.filter(
    (widget) => widget.point === 'popular_airlines'
  )

  const teaser_bottom = widgets.filter(
    (widget) => widget.point === 'teaser_bottom'
  )
  const teaser = widgets.filter((item) => item.point === 'teaser')
  const bottomContents = widgets.filter(
    (widget) => widget.point === 'bottom_contents'
  )

  return (
    <>
      <div className='relative border-b bg-blue-800 py-5 shadow-xs md:py-9'>
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
      <div>
        <Container className='grid gap-3 py-5 md:gap-7 md:py-10'>
          <div className='flex flex-col gap-7 md:gap-12'>
            <div>
              <Title fz={'h3'} mb={'lg'}>
                Seyahatinizi Yönetin
              </Title>
              <div className='flex gap-4 overflow-x-auto font-semibold md:grid md:grid-cols-3 md:gap-4'>
                {teaser &&
                  teaser.length > 0 &&
                  teaser
                    .sort((a, b) => (a.ordering || 0) - (b.ordering || 0))
                    .map((item) => (
                      <a
                        key={item.id}
                        href={item.params?.link?.value}
                        className='flex-shrink-0 md:flex-shrink'
                      >
                        <div className='grid min-w-[100px] items-center gap-2 rounded border bg-white p-1 md:min-w-0 md:p-3'>
                          <div>
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                              }}
                              className='flex items-center justify-center rounded-full border bg-gray-300'
                              dangerouslySetInnerHTML={{
                                __html: item.params?.svg?.value || '',
                              }}
                            />
                          </div>
                          <div>
                            {item.title}
                            <br />
                            <div
                              className='text-sm font-normal text-gray-600'
                              dangerouslySetInnerHTML={{
                                __html: item.params?.description?.value,
                              }}
                            ></div>
                          </div>
                        </div>
                      </a>
                    ))}
              </div>
            </div>

            {popularDomesticFlights.length > 0 && (
              <div>
                <Title fz={'h3'} mb={'lg'}>
                  Yurt İçi Popüler Uçuşlar
                </Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularDomesticFlights.map((flight) => (
                    <ProductBox
                      key={flight.id}
                      description={flight.params.sort_desc.value}
                      image={flight.params.image.value}
                      title={flight.title}
                      url={
                        (flight.params.link.value &&
                        flight.params.link.value.length > 0
                          ? `/flight/search-results?${flight.params.link.value}`
                          : '') as Route
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            {popularInternationalFlights.length > 0 && (
              <div>
                <Title order={4} mb={'lg'} fz={'h3'}>
                  Yurt Dışı Popüler Uçuşlar
                </Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularInternationalFlights.map((flight) => (
                    <ProductBox
                      key={flight.id}
                      description={flight.params.sort_desc.value}
                      image={flight.params.image.value}
                      title={flight.title}
                      url={
                        (flight.params.link.value &&
                        flight.params.link.value.length > 0
                          ? `/flight/search-results?${flight.params.link.value}`
                          : '') as Route
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            {popular_airlines.length > 0 && (
              <div>
                <Title fz={'h3'} mb={'lg'}>
                  Popüler Hava Yolları
                </Title>
                <div className='overflow-x-auto'>
                  <div className='flex w-[200px] gap-3 md:w-0'>
                    {popular_airlines.map((airline) => (
                      <div
                        key={airline.id}
                        className='flex h-[60px] items-center gap-3 rounded-md border p-5'
                      >
                        <div>
                          <AspectRatio miw={30} maw={30}>
                            <Image
                              src={cdnImageUrl(airline.params.image.value)}
                              alt={airline.title}
                            />
                          </AspectRatio>
                        </div>
                        <div>{airline.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {teaser_bottom.length > 0 && (
              <div className='grid gap-6 rounded-md border bg-white p-3 md:p-6'>
                {teaser_bottom.map((teaser) => (
                  <article key={teaser.id}>
                    <Title fz={'h3'} mb={'md'}>
                      {teaser.title}
                    </Title>
                    <Typography>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: teaser.params.description.value,
                        }}
                      />
                    </Typography>
                  </article>
                ))}
              </div>
            )}
            {bottomContents.length > 0 && (
              <div className='grid gap-6 rounded-md border bg-white p-3 md:p-6'>
                {bottomContents.map((content) => (
                  <article key={content.id}>
                    <Title fz={'h3'} mb={'md'}>
                      {content.title}
                    </Title>
                    <Typography>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: content.params.description.value,
                        }}
                      />
                    </Typography>
                  </article>
                ))}
              </div>
            )}
            {faqs.length > 0 && (
              <div>
                <Title order={2} mb={'lg'} fz={'h3'}>
                  Sıkça Sorulan Sorular
                </Title>
                <Accordion
                  chevronPosition='right'
                  variant='contained'
                  radius='md'
                >
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
          </div>
        </Container>
      </div>
    </>
  )
}
