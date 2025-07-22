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

export default async function HotelLandingPage() {
  const data = (
    await getContent<CmsContent<HotelLandingWidgets[], HotelLandingParams>>(
      'otel/otel'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data

  const popular_domestic_cities = widgets.filter(
    (x) => x.point === 'popular_domestic_cities'
  )
  const popular_abroad_cities = widgets.filter(
    (x) => x.point === 'popular_abroad_cities'
  )
  const faqs = widgets.filter((x) => x.point === 'sss')
  const teaser_bottom = widgets.filter(
    (widget) => widget.point === 'teaser_bottom'
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
          <Title fz={'h2'} pb={'md'} c={'white'}>
            {params.sub_title.value}
          </Title>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <HotelSearchEngine />
          </div>
        </Container>
      </div>
      <Container className='grid gap-3 py-5 md:gap-7 md:py-10'>
        {popular_domestic_cities.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              Yurt İçi Popüler Şehirler
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {popular_domestic_cities.map((item) => (
                <ProductBox
                  key={item.id}
                  description={item.params.sort_desc.value}
                  image={item.params.image.value}
                  title={item.title}
                  url={
                    item.params.link.value.length > 0
                      ? `/hotel/search-results?${item.params.link.value}`
                      : ''
                  }
                />
              ))}
            </div>
          </div>
        )}
        {popular_abroad_cities.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              Yurt Dışı Popüler Şehirler
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {popular_abroad_cities.map((item) => (
                <ProductBox
                  key={item.id}
                  description={item.params.sort_desc.value}
                  image={item.params.image.value}
                  title={item.title}
                  url={
                    item.params.link.value.length > 0
                      ? `/hotel/search-results?${item.params.link.value}`
                      : ''
                  }
                />
              ))}
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
