'use client'

import { Link } from 'next-view-transitions'
import { BackgroundImage, Skeleton } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import useEmblaCarousel from 'embla-carousel-react'

import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export const StorySliderSkeleton = () => {
  return (
    <div className='flex w-full justify-center gap-5 overflow-hidden whitespace-nowrap'>
      {new Array(10).fill(true).map((_, itemIndex) => (
        <div key={itemIndex} className='flex flex-col gap-2'>
          <Skeleton h={110} circle w={110} />
          <Skeleton h={16} radius={'md'} />
          <Skeleton h={16} radius={'md'} w={'65%'} mx='auto' />
        </div>
      ))}
    </div>
  )
}

type IProps = {
  data: Widgets
}

const StorySlider: React.FC<IProps> = ({ data }) => {
  const dealsOfWeekData = data
  const [isEmblaInitialized, setIsEmblaInitialized] = useState(false)

  useEffect(() => {
    setIsEmblaInitialized(true)
  }, [])

  return (
    <div className='relative'>
      {!isEmblaInitialized && (
        <div className='absolute start-0 end-0 overflow-hidden whitespace-nowrap'>
          <StorySliderSkeleton />
        </div>
      )}
      <Carousel
        slideSize={{
          base: '50%',
          sm: '30%',
          md: 150,
        }}
        withControls={false}
        className={clsx({
          'opacity-0': !isEmblaInitialized,
        })}
      >
        {dealsOfWeekData?.map((item) => {
          return (
            <Carousel.Slide key={item.id}>
              <Link href={item.params.link.value} className='block'>
                <div className='group grid justify-center gap-1 py-3 text-center'>
                  <div className='size-[100px] scale-100 justify-self-center overflow-hidden rounded-full border-3 border-orange-600 p-1 transition-[scale] group-hover:scale-110 group-hover:border-blue-500'>
                    <BackgroundImage
                      src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image.value}`}
                      className='size-full rounded-full'
                    />
                  </div>
                  <div className='pt-2 text-sm leading-tight'>{item.title}</div>
                </div>
              </Link>
            </Carousel.Slide>
          )
        })}
      </Carousel>
    </div>
  )
}

export { StorySlider }
