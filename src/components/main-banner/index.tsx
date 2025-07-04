'use client'
import { useEffect, useState } from 'react'
import {
  ActionIcon,
  AspectRatio,
  Box,
  Container,
  Image,
  Skeleton,
} from '@mantine/core'
import { Link } from 'next-view-transitions'

import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'

import { Carousel } from '@mantine/carousel'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import clsx from 'clsx'
import { cdnImageUrl } from '@/libs/cms-data'

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
        className={clsx('w-full', {
          'opacity-100': !!emblaApi,
          'opacity-0': !emblaApi,
        })}
      >
        {slides.map((slide) => {
          return (
            <Carousel.Slide key={slide.id} className='rounded'>
              <Box
                component={Link}
                href={slide.params.link?.value || '#'}
                display={'block'}
                w={'100%'}
              >
                <AspectRatio
                  ratio={16 / 9}
                  h={{
                    base: 190,
                    md: 487,
                  }}
                >
                  <Image
                    src={cdnImageUrl(slide.params.image.value)}
                    alt={slide.Title}
                    h={'100%'}
                    pos={'absolute'}
                    bdrs={'lg'}
                  />
                </AspectRatio>
              </Box>
            </Carousel.Slide>
          )
        })}
      </Carousel>
      <div className='flex justify-center gap-4 pt-5'>
        <div>
          <ActionIcon
            radius={'xl'}
            bg={'blue.1'}
            c='blue.8'
            bdrs={'100%'}
            onClick={() => emblaApi?.scrollPrev()}
            size={'40'}
          >
            <RiArrowLeftLine />
          </ActionIcon>
        </div>
        <div className='flex items-center gap-2'>
          {emblaApi?.scrollSnapList().map((snap, snapIndex) => {
            const isActiveState = currentSlideIndex === snapIndex
            return (
              <ActionIcon
                radius='xl'
                key={snap}
                bg={isActiveState ? 'blue.8' : 'blue.2'}
                bdrs={'100%'}
                size={isActiveState ? 16 : 12}
                onClick={() => {
                  emblaApi.scrollTo(snapIndex)
                }}
                className='transition-all ease-in'
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
            size={'40'}
          >
            <RiArrowRightLine />
          </ActionIcon>
        </div>
      </div>
    </div>
  )
}

export { MainBannerCarousel }
