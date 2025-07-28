import {
  Container,
  Title,
  Image,
  ScrollArea,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Typography,
} from '@mantine/core'
import NextImage from 'next/image'

import { CarRentSearchPanel } from '@/modules/carrent'
import { cdnImageUrl, getContent } from '@/libs/cms-data'
import {
  CarLandingParams,
  CarLandingWidget,
  CmsContent,
} from '@/types/cms-types'
import { notFound } from 'next/navigation'
import ProductBox from '../_components/box-link'

export default async function CarLandingPage() {
  const data = (
    await getContent<CmsContent<CarLandingWidget[], CarLandingParams>>(
      'arac/arac'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data
  const providers = widgets.find((item) => item.point === 'providers')
  const popularDomesticLocations = widgets.filter(
    (item) => item.point === 'domestic_react_locations'
  )
  const popularLocationsAbroad = widgets.filter(
    (item) => item.point === 'int_react_locations'
  )
  const faqs = widgets.filter((item) => item.point === 'sss')
  const teaser_bottom = widgets.filter((item) => item.point === 'teaser_bottom')
  console.log(popularDomesticLocations)

  return (
    <div className='py-6 md:py-10'>
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
            <CarRentSearchPanel />
          </div>
        </Container>
      </div>

      <Container pt={{ base: 'md', sm: 'xl' }}>
        <div>
          <Title order={2} fz={'h3'} className='pb-3 text-center'>
            {providers?.title}
          </Title>
          <div>
            <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
              <div className='flex gap-3'>
                {providers?.params.images.list.map(
                  (providerImageUrl, provideIndex) => {
                    return (
                      <div key={provideIndex}>
                        <div className='flex h-[60px] w-[130px] items-center justify-center rounded-md border p-2'>
                          <div className='relative h-full w-full flex-1'>
                            <Image
                              fill
                              component={NextImage}
                              priority={false}
                              src={cdnImageUrl(providerImageUrl)}
                              alt=''
                              objectFit='contain'
                            />
                          </div>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className='grid gap-6 pt-6 md:gap-12 md:pt-12'>
          <div className='flex justify-center'>
            <Title fz={'h3'}>Popüler araç kiralama noktaları</Title>
          </div>

          <div>
            <Title order={4} fz={'h3'} mb={'lg'}>
              Yurt İçi Araç Kiralama Noktaları
            </Title>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
              {popularDomesticLocations.map((item) => (
                <ProductBox
                  key={item.id}
                  description=''
                  image={item.params.image.value}
                  title={item.title}
                  url={`/car/search-results?${item.params.link.value}`}
                  // url={item.l}
                />
              ))}
            </div>
          </div>
          <div>
            <Title order={4} fz={'h3'} mb={'lg'}>
              Yurt Dışı Araç Kiralama Noktaları
            </Title>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
              {popularLocationsAbroad.map((item) => (
                <ProductBox
                  key={item.id}
                  description=''
                  image={item.params.image.value}
                  title={item.title}
                  url={`/car/search-results?${item.params.link.value}`}
                  // url={item.l}
                />
              ))}
            </div>
          </div>

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
  )
}
