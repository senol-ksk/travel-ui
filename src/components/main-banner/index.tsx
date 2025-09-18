'use client'

import { useEffect, useRef, useState } from 'react'
import { ActionIcon, AspectRatio, Box, Image, Skeleton } from '@mantine/core'
import { Link } from 'next-view-transitions'
import Autoplay from 'embla-carousel-autoplay'

import { EmblaCarouselType } from 'embla-carousel'

import { Carousel } from '@mantine/carousel'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import clsx from 'clsx'
import { cdnImageUrl } from '@/libs/cms-data'
import { Route } from 'next'

type SlideType = {
  id: string
  params: {
    image: { value: string }
    link?: { value: string }
  }
  Title: string
}

type PropType = {
  slides: SlideType[]
}

const MainBannerCarousel: React.FC<PropType> = ({ slides }) => {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const autoplay = useRef(Autoplay({ delay: 3000 }))

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', (event) => {
      const scrollProgress = emblaApi.selectedScrollSnap()

      setCurrentSlideIndex(scrollProgress)
    })
  }, [emblaApi])

  return (
    <div className='relative'>
      {!emblaApi && (
        <div className='absolute start-0 end-0 top-0 bottom-0 z-10 h-full'>
          <Skeleton h={'100%'} />
        </div>
      )}
      <Carousel
        withIndicators={false}
        withControls={false}
        getEmblaApi={setEmblaApi}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        slideGap={'md'}
        className={clsx('w-full', {
          'opacity-100': !!emblaApi,
          'opacity-0': !emblaApi,
        })}
      >
        {slides.map((slide) => {
          return (
            <Carousel.Slide key={slide.id}>
              <Box
                component={Link}
                href={(slide.params.link?.value || '#') as Route}
                className='block'
              >
                <AspectRatio ratio={2.6 / 1}>
                  <Image
                    className='rounded-lg'
                    src={cdnImageUrl(slide.params.image.value)}
                    alt={slide.Title}
                    bdrs={{ base: 'md', md: 'lg' }}
                  />
                </AspectRatio>
              </Box>
            </Carousel.Slide>
          )
        })}
      </Carousel>
      <div className='hidden justify-between gap-4 pt-5 md:flex md:justify-center'>
        <div>
          <ActionIcon
            radius={'xl'}
            bg={'blue.1'}
            c='blue.8'
            bdrs={'100%'}
            onClick={() => emblaApi?.scrollPrev()}
            size={'50'}
            className='transition-all ease-in hover:scale-110'
          >
            <RiArrowLeftLine />
          </ActionIcon>
        </div>
        <div className='hidden items-center gap-2 md:flex'>
          {emblaApi?.scrollSnapList().map((snap, snapIndex) => {
            const isActiveState = currentSlideIndex === snapIndex
            return (
              <ActionIcon
                radius='xl'
                key={snap}
                bg={isActiveState ? 'blue.8' : 'blue.2'}
                bdrs={'100%'}
                size={isActiveState ? 21 : 14}
                onClick={() => {
                  emblaApi.scrollTo(snapIndex)
                }}
                className='transition-all ease-in hover:scale-140'
              />
            )
          })}
        </div>
        <div>
          <ActionIcon
            radius='xl'
            bg={'blue.1'}
            c='blue.8'
            bdrs={'100%'}
            onClick={() => emblaApi?.scrollNext()}
            size={'50'}
            className='transition-all ease-in hover:scale-110'
          >
            <RiArrowRightLine />
          </ActionIcon>
        </div>
      </div>
    </div>
  )
}

export { MainBannerCarousel }
