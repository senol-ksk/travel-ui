'use client'

import { Link } from 'next-view-transitions'
import { BackgroundImage, Skeleton } from '@mantine/core'
import { Carousel } from '@mantine/carousel'

import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export const StorySliderSkeleton = () => {
  return (
    <div className='flex w-full justify-start gap-5 overflow-hidden whitespace-nowrap'>
      {new Array(10).fill(true).map((_, itemIndex) => (
        <div key={itemIndex} className='flex flex-col gap-2'>
          <Skeleton h={110} circle w={110} />
          <Skeleton h={16} radius='md' />
          <Skeleton h={16} radius='md' w='65%' mx='auto' />
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
        slideGap='xl'
        withControls={false}
        className={clsx({
          'opacity-0': !isEmblaInitialized,
        })}
      >
        {dealsOfWeekData?.map((item) => {
          return (
            <Carousel.Slide key={item.id}>
              <Link href={item.params.link.value} className='block'>
                <div className='group grid justify-center gap-1 pt-[50px] pb-[50px] text-center'>
                  <div className='relative h-[240px] w-[180px] overflow-hidden rounded-full transition-transform group-hover:scale-110'>
                    <div className='absolute bottom-0 left-0 h-50 w-full bg-gradient-to-t from-black to-transparent opacity-80 group-hover:opacity-50'></div>
                    <BackgroundImage
                      src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image.value}`}
                      className='size-full rounded-full'
                    />
                    <div className='absolute bottom-2 left-1/2 mb-4 -translate-x-1/2 text-sm font-semibold text-white'>
                      {item.title}
                    </div>
                  </div>
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
