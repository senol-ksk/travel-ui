import { Suspense } from 'react'
import {
  Skeleton,
  Container,
  Title,
  Image,
  ScrollArea,
  AspectRatio,
} from '@mantine/core'
import NextImage from 'next/image'

import { SearchEngine } from '@/components/search-engine/'
import { StorySlider } from '@/components/home/story-slider'
import { cdnImageUrl, getContent } from '@/libs/cms-data'
import { CmsContent, Params, Widgets } from '@/types/cms-types'

export default async function Home() {
  const cmsData = (await getContent<CmsContent<Widgets, Params>>('ana-sayfa'))
    ?.data

  const dealsOfWeekData = cmsData?.widgets.filter(
    (x) => x.point === 'deals_of_week'
  )
  const opportunities = cmsData?.widgets?.filter(
    (x) => x.point == 'opportunity'
  )
  const earlyList = cmsData?.widgets?.filter(
    (x) => x.point == 'early_rezervation'
  )

  return (
    <>
      <Suspense fallback={<Skeleton h={20} />}>
        <div className='relative'>
          <Title className='text-dark pt-5 text-center text-lg text-shadow-md md:pt-13 md:text-4xl md:text-white'>
            FullTrip ile seyahat planlamak çok kolay
          </Title>
          <Image
            component={NextImage}
            src='https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg'
            fill
            alt='Fulltrip'
            priority
            className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
          />
          <div className='md:min-h-[280px] md:pt-10'>
            <Container className='px-0 md:px-4'>
              <div className='bg-white md:rounded-lg md:border'>
                <SearchEngine />
              </div>
            </Container>
          </div>
        </div>
      </Suspense>

      {dealsOfWeekData && (
        <div className='py-6'>
          <StorySlider data={dealsOfWeekData} />
        </div>
      )}

      <Container className='flex flex-col gap-3 py-4 md:gap-5 md:py-10'>
        {opportunities && earlyList && (
          <div className='gap-3 md:grid md:grid-cols-3'>
            <div className='col-span-2'>
              <ScrollArea
                scrollbars='x'
                offsetScrollbars
                scrollbarSize={6}
                h={300}
              >
                <div className='flex gap-3'>
                  {opportunities.map((opportunity) => {
                    return (
                      <AspectRatio
                        ratio={16 / 9}
                        key={opportunity.id}
                        className='relative h-[300px] w-[600px]'
                      >
                        <Image
                          radius={'md'}
                          src={cdnImageUrl(opportunity.params.image.value)}
                          component={NextImage}
                          priority={false}
                          loading='lazy'
                          alt={opportunity.title}
                          width={600}
                          height={300}
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </AspectRatio>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
            <div className='gap-3 md:grid md:grid-cols-2'>
              {earlyList.map((list) => (
                <div key={list.id} className='relative size-full'>
                  <Image
                    radius={'md'}
                    src={cdnImageUrl(list.params.image.value)}
                    component={NextImage}
                    fill
                    priority={false}
                    loading='lazy'
                    alt={list.title}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
