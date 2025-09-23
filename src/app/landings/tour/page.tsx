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
import { headers } from 'next/headers'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { TourSearchEngine } from '@/modules/tour'
import {
  CmsContent,
  TourLandingParams,
  TourLandingWidget,
} from '@/types/cms-types'
import dayjs from 'dayjs'

import { serializeTourSearchParams } from '@/modules/tour/searchResultParams'
import { notFound } from 'next/navigation'
import { Route } from 'next'
import ProductBox from '../_components/box-link'

export default async function TourLandingPage() {
  const data = (
    await getContent<CmsContent<TourLandingWidget[], TourLandingParams>>(
      'tur/tur'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data
  const abroadTours = widgets?.filter((x) => x.point == 'abroad_tours')
  const abroadToursTitle = widgets?.find((x) => x.point == 'abroad_title')
  const aidTours = widgets?.filter((x) => x.point == 'aid_tours')
  const aidTitle = widgets?.find((x) => x.point == 'aid_title')
  const shipTours = widgets?.filter((x) => x.point == 'ship_tours')
  const shipTitle = widgets?.find((x) => x.point == 'ship_title')
  const faqs = widgets?.filter((x) => x.point == 'sss')
  const europe_tours = widgets?.filter((x) => x.point == 'europe_tours')
  const europe_tours_title = widgets?.find((x) => x.point == 'europe_title')
  const bottom_content = widgets?.filter((x) => x.point == 'bottom_content')
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
      {/* yurt ıcı kultur turu */}
      <Container className='grid grid-cols-1 gap-8 py-5 md:gap-12 md:py-10'>
        {aidTours.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              {aidTitle?.title}
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {aidTours.map((tour) => (
                <ProductBox
                  key={tour.id}
                  description=''
                  image={tour.params.image.value}
                  title={tour.title}
                  url={tour.params.link.value as Route}
                />
              ))}
            </div>
          </div>
        )}
        {abroadTours.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              {abroadToursTitle?.title}
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {abroadTours.map((tour) => (
                <ProductBox
                  key={tour.id}
                  description=''
                  image={tour.params.image.value}
                  title={tour.title}
                  url={tour.params.link.value as Route}
                />
              ))}
            </div>
          </div>
        )}

        {shipTours.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              {shipTitle?.title}
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {shipTours.map((tour) => (
                <ProductBox
                  key={tour.id}
                  description=''
                  image={tour.params.image.value}
                  title={tour.title}
                  url={tour.params.link.value as Route}
                />
              ))}
            </div>
          </div>
        )}
        {europe_tours.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              {europe_tours_title?.title}
            </Title>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {europe_tours.map((tour) => (
                <ProductBox
                  key={tour.id}
                  description=''
                  image={tour.params.image.value}
                  title={tour.title}
                  url={tour.params.link.value as Route}
                />
              ))}
            </div>
          </div>
        )}
        {bottom_content.length > 0 &&
          bottom_content.map((content) => (
            <div key={content.id} className='rounded-md border p-3'>
              <Title order={2} fz={'h3'}>
                {content.title}
              </Title>
              <Typography>
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.params.description.value,
                  }}
                />
              </Typography>
            </div>
          ))}
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
