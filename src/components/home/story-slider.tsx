'use client'

import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Image, Skeleton, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

import aspectRatioClasses from './storyitems.module.css'
import { cdnImageUrl } from '@/libs/cms-data'

export const StorySliderSkeleton = () => {
  return (
    <div className='flex w-full justify-start gap-5 overflow-hidden whitespace-nowrap'>
      {new Array(10).fill(true).map((_, itemIndex) => (
        <div key={itemIndex} className='flex flex-col gap-2'>
          <Skeleton h={110} w={410} />
          <Skeleton h={16} radius='xs' />
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
  const autoplay = useRef(Autoplay({ delay: 3000 }))

  return (
    <div className='relative px-4 sm:px-0'>
      {!isEmblaInitialized && (
        <div className='absolute start-0 end-0 overflow-hidden whitespace-nowrap'>
          <StorySliderSkeleton />
        </div>
      )}
      <Carousel
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        emblaOptions={{
          dragFree: true,
          align: 'center',
          containScroll: false,
          startIndex: dealsOfWeekData.length / 2,
        }}
        slideSize={'auto'}
        slideGap={{ base: 30, md: 40 }}
        withControls={false}
        className={clsx('mx-auto', {
          'opacity-0': !isEmblaInitialized,
        })}
      >
        {dealsOfWeekData?.map((item) => (
          <Carousel.Slide key={item.id}>
            <Box
              component={Link}
              href={item.params.link.value}
              className='block h-full'
            >
              <div className='flex h-full w-[90px] flex-col md:w-[160px]'>
                <AspectRatio classNames={aspectRatioClasses}>
                  <Image src={cdnImageUrl(item.params.image.value)} alt='' />
                </AspectRatio>
                <div className='leading-md py-4 text-center text-sm'>
                  <Text lineClamp={3} component='div'>
                    {item.title}
                  </Text>
                </div>
                <div className='mx-auto mt-auto h-[4px] w-[69px] rounded bg-blue-200' />
              </div>
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}
export { StorySlider }
