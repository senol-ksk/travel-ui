'use client'

import { Link } from 'next-view-transitions'
import { BackgroundImage, Skeleton, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

import { GoArrowRight } from 'react-icons/go'

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
    <div className='relative'>
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
          loop: true,
          dragFree: true,
          align: 'start',
        }}
        slideSize={{
          base: '100%',
          sm: '45%',
          md: '28%',
        }}
        withControls={false}
        className={clsx({
          'opacity-0': !isEmblaInitialized,
        })}
      >
        {dealsOfWeekData?.map((item) => (
          <Carousel.Slide key={item.id}>
            <Link href={item.params.link.value} className='block'>
              <div className='flex h-[120px] w-[400px] overflow-hidden rounded-2xl shadow-xl'>
                <div className='flex w-1/2 flex-col justify-between bg-yellow-400 p-3'>
                  <div>
                    <Text fw={500}>{item.title}</Text>
                  </div>
                  <Text
                    size='sm'
                    fw={500}
                    className='flex items-center hover:underline'
                  >
                    İncele <GoArrowRight />
                  </Text>
                </div>
                <div className='h-full w-1/2'>
                  <BackgroundImage
                    src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image.value}`}
                    className='h-full w-full bg-cover bg-center object-cover'
                  />
                </div>
              </div>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}
export { StorySlider }
