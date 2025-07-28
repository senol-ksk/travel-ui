import {
  Box,
  Container,
  Title,
  Image,
  Typography,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { BusSearchEngine } from '@/modules/bus'
import {
  BusLandingParams,
  BusLandingWidgets,
  CmsContent,
} from '@/types/cms-types'
import { notFound } from 'next/navigation'

export default async function BusLandingPage() {
  const data = (
    await getContent<CmsContent<BusLandingWidgets[], BusLandingParams>>(
      'otobus/otobus'
    )
  )?.data

  if (!data) return notFound()

  const { params, widgets } = data

  const popularBusServices = widgets.filter(
    (item) => item.point === 'popular_bus_services'
  )
  const teaser_bottom = widgets.filter((item) => item.point === 'teaser_bottom')
  const faqs = widgets.filter((item) => item.point === 'sss')

  console.log(faqs)

  return (
    <div>
      <div className='border-b py-5'>
        <Container>
          <Title fz={'h2'} pb={'md'}>
            {params.sub_title.value}
          </Title>
          <BusSearchEngine />
        </Container>
      </div>
      <div className='py-5 md:py-9'>
        <Container className='grid grid-cols-1 gap-8 md:gap-12'>
          {popularBusServices.length > 0 && (
            <div>
              <Title order={2} fz={'h3'}>
                Populer Otobüs Seferleri
              </Title>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4'>
                {popularBusServices.map((bus) => (
                  <Box key={bus.id} className='relative h-[200px]'>
                    <Image
                      component={NextImage}
                      fill
                      src={cdnImageUrl(bus.params.image.value)}
                      alt=''
                      className='z-0 rounded-lg'
                    />

                    <div className='absolute bottom-0 z-10 p-3 text-lg font-semibold text-white'>
                      {bus.title}
                    </div>
                  </Box>
                ))}
              </div>
            </div>
          )}

          {teaser_bottom.length > 0 && (
            <div className='grid gap-6 rounded-md border bg-white p-3 md:p-6'>
              {teaser_bottom.map((teaser) =>
                teaser.params.description?.value ? (
                  <article key={teaser.id}>
                    <Title fz={'h3'} mb={'md'}>
                      {teaser.title}
                    </Title>
                    <Typography>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: teaser.params.description?.value,
                        }}
                      />
                    </Typography>
                  </article>
                ) : null
              )}
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
                  return faq.params.description &&
                    faq.params.description?.value ? (
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
                  ) : null
                })}
              </Accordion>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}
