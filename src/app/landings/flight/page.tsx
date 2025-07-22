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
        <Container className='py-10'>
          <div className='flex flex-col gap-7 md:gap-12'>
            {popularDomesticFlights.length > 0 && (
              <div>
                <Title fz={'h3'} mb={'lg'}>
                  Yurt İçi Popüler Uçuşlar
                </Title>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  {popularDomesticFlights.map((flight) => (
                    <TicketBox
                      key={flight.id}
                      description={flight.params.sort_desc.value}
                      image={flight.params.image.value}
                      title={flight.title}
                      url={
                        flight.params.link.value &&
                        flight.params.link.value.length > 0
                          ? `/flight/search-results?${flight.params.link.value}`
                          : ''
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
                    <TicketBox
                      key={flight.id}
                      description={flight.params.sort_desc.value}
                      image={flight.params.image.value}
                      title={flight.title}
                      url={
                        flight.params.link.value &&
                        flight.params.link.value.length > 0
                          ? `/flight/search-results?${flight.params.link.value}`
                          : ''
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
                <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
                  <div className='flex gap-4 whitespace-nowrap'>
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
                </ScrollArea>
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

type TicketBoxProps = {
  image: string
  title: string
  description: string
  url: string
}

function TicketBox({ url, image, title, description }: TicketBoxProps) {
  return (
    <Box
      component={Link}
      href={url}
      className='group relative flex h-[200px] flex-col justify-end overflow-hidden rounded-lg border bg-white p-3 text-white'
      style={{ backgroundImage: `url(${cdnImageUrl(image)})` }}
      bgsz={'cover'}
      bgp={'center'}
    >
      <div
        className='absolute top-0 right-0 bottom-0 left-0 -z-0 block bg-black/20 transition-all group-hover:bg-black/35'
        aria-hidden
      />
      <div className='relative z-10'>
        <div className='text-lg font-bold'>{title}</div>
        <div>{description}</div>
      </div>
    </Box>
  )
}
