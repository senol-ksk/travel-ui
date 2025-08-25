import {
  Container,
  Title,
  Image,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Typography,
} from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { HotelSearchEngine } from '@/modules/hotel'
import {
  CmsContent,
  HotelLandingParams,
  HotelLandingWidgets,
} from '@/types/cms-types'

import { notFound } from 'next/navigation'
import ProductBox from '../_components/box-link'
import { Route } from 'next'

export default async function HotelLandingPage() {
  const data = (
    await getContent<CmsContent<HotelLandingWidgets[], HotelLandingParams>>(
      'otel/otel'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data

  const popular_domestic_cities = widgets.filter(
    (x) => x.point === 'popular_places'
  )
  const popular_abroad_cities = widgets.filter(
    (x) => x.point === 'popular_places'
  )
  const faqs = widgets.filter((x) => x.point === 'sss')
  const teaser_bottom = widgets.filter(
    (widget) => widget.point === 'teaser_bottom'
  )
  const teaser = widgets.filter((item) => item.point === 'teaser')

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
      <Container className='grid gap-3 py-5 md:gap-7 md:py-10'>
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
        {popular_domestic_cities.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              Yurt İçi Popüler Şehirler
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {popular_domestic_cities.map((item) => (
                <ProductBox
                  description=''
                  key={item.id}
                  image={item.params.image.value}
                  title={item.title}
                  url={
                    item.params.link.value.length > 0
                      ? `/hotel/search-results?${item.params.link.value}`
                      : '/'
                  }
                />
              ))}
            </div>
          </div>
        )}
        {/* {popular_abroad_cities.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              Yurt Dışı Popüler Şehirler
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {popular_abroad_cities.map((item) => (
                <ProductBox
                  description=' '
                  key={item.id}
                  image={item.params.image.value}
                  title={item.title}
                  url={
                    item.params.link.value.length > 0
                      ? `/hotel/search-results?${item.params.link.value}`
                      : '/'
                  }
                />
              ))}
            </div>
          </div>
        )} */}
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
