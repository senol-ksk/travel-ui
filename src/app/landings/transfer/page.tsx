import {
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
import { TransferSearchEngine } from '@/modules/transfer'
import {
  CmsContent,
  TransferLandingParams,
  TransferLandingWidget,
} from '@/types/cms-types'
import { notFound } from 'next/navigation'

export default async function TransferLandingPage() {
  const data = (
    await getContent<
      CmsContent<TransferLandingWidget[], TransferLandingParams>
    >('transfer/transfer')
  )?.data

  if (!data) return notFound()
  const { widgets, params } = data
  const teaser = widgets.filter((item) => item.point === 'teaser')
  const content = widgets?.find((x) => x.point == 'content')
  const bottomContents = widgets?.filter((x) => x.point == 'bottom_content')
  const faqs = widgets?.filter((x) => x.point == 'sss')
  const populerTransferPoints = widgets?.filter(
    (x) => x.point == 'populer_transfer_points'
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
          <Title c={'white'} pb={'md'}>
            {params.sub_title.value}
          </Title>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <TransferSearchEngine />
          </div>
        </Container>
      </div>
      <Container className='grid grid-cols-1 gap-8 py-5 md:gap-12 md:py-10'>
        {/* {content && (
          <div>
            <Title order={2} mb={'md'}>
              {content.title}
            </Title>
            <div className='grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3'>
              <div className='flex justify-center md:order-2 md:col-span-1'>
                <Image
                  component={NextImage}
                  src={cdnImageUrl(content.params.image.value)}
                  width={200}
                  height={200}
                  alt={content.title}
                  radius={'md'}
                />
              </div>
              <div className='md:col-span-2'>
                <Typography>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content.params.description.value,
                    }}
                  />
                </Typography>
              </div>
            </div>
          </div>
        )} */}

        {populerTransferPoints.length > 0 && (
          <div>
            <Title fz={'h3'} mb={'lg'}>
              Popüler Transfer Noktaları
            </Title>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4'>
              {populerTransferPoints.map((destination) => {
                return (
                  <div key={destination.id} className='relative h-[200px]'>
                    <Image
                      component={NextImage}
                      src={cdnImageUrl(destination.params.image.value)}
                      fill
                      alt={destination.title}
                      radius={'md'}
                    />
                    <div className='leading-lg absolute bottom-0 z-10 w-full rounded-b-md bg-black/30 p-3 text-lg font-semibold text-white'>
                      {destination.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {bottomContents.length > 0 &&
          bottomContents.map((content) => {
            return (
              <div key={content.id} className='rounded-md border p-3'>
                <Title order={2} mb={'lg'} fz={'h3'}>
                  {content.title}{' '}
                </Title>
                <div>
                  <Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: content.params.description.value,
                      }}
                    />
                  </Typography>
                </div>
              </div>
            )
          })}
        {faqs.length > 0 && (
          <div>
            <Title order={2} mb={'lg'} fz={'h3'}>
              Sıkça Sorulan Sorular
            </Title>
            <Accordion chevronPosition='right' variant='contained' radius='md'>
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
  )
}
