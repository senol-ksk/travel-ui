import { Container, Title, Image } from '@mantine/core'
import NextImage from 'next/image'

import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { TransferSearchEngine } from '@/modules/transfer'
import {
  CmsContent,
  TransferLandingParams,
  TransferLandingWidget,
} from '@/types/cms-types'

export default async function TransferLandingPage() {
  const data = (
    await getContent<
      CmsContent<TransferLandingWidget[], TransferLandingParams>
    >('transfer/transfer')
  )?.data

  if (!data) return null
  const { widgets, params } = data
  const teaser = widgets.filter((item) => item.point === 'teaser')
  const content = widgets?.find((x) => x.point == 'content')
  const bottomContents = widgets?.filter((x) => x.point == 'bottom_contents')
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
      <Container className='flex flex-col gap-3 py-5 md:gap-7 md:py-10'>
        <div className='py-4 md:py-7'>
          <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 md:gap-4'>
            {teaser.map((teaserItem) => (
              <div
                key={teaserItem.id}
                className='flex items-center rounded border p-3'
              >
                {teaserItem.title}
              </div>
            ))}
          </div>
        </div>
        {bottomContents.length > 0 &&
          bottomContents.map((content) => {
            return (
              <div key={content.id}>
                <Title order={3}>{content.title}</Title>
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content.params.description.value,
                    }}
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={cdnImageUrl(content.params.image.value)}
                    alt={content.title}
                    radius={'md'}
                  />
                </div>
              </div>
            )
          })}

        {content && (
          <div>
            <Title order={2}>{content.title}</Title>
            <div className='grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3'>
              <div className='col-span-1 flex justify-center md:order-2'>
                <Image
                  component={NextImage}
                  src={cdnImageUrl(content.params.image.value)}
                  width={200}
                  height={200}
                  alt={content.title}
                  radius={'md'}
                />
              </div>
              <div className='col-span-2'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.params.description.value,
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {populerTransferPoints.length > 0 && (
          <div>
            <Title order={2} fz={'h3'}>
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
      </Container>
    </div>
  )
}
