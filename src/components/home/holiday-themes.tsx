'use client'

import { Carousel } from '@mantine/carousel'
import { Image, Text } from '@mantine/core'
import Link from 'next/link'
import { Widgets } from '@/types/cms-types'
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
import { useRef } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { Route } from 'next'

type IProps = {
  data: Widgets
}

const HolidayThemes: React.FC<IProps> = ({ data }) => {
  const emblaRef = useRef<EmblaCarouselType | null>(null)

  return (
    <div className='relative'>
      <h2 className='mt-15 mb-5 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
        Tatil Temaları
      </h2>
      <p className='text-center text-sm text-gray-600 md:text-base'>
        Tatil planlarına başlamadan önce size fikir verebilecek farklı
        kriterlere göre sınıflandırılmış otellere göz atabilir, detaylı bilgi
        sahibi olabilirsiniz.
      </p>

      <div className='relative'>
        <Carousel
          slideGap='xs'
          slideSize='100%'
          withControls={false}
          getEmblaApi={(api) => (emblaRef.current = api)}
        >
          {data?.map((item) => (
            <Carousel.Slide
              key={item.id}
              className='!basis-full p-5 px-5 transition-all duration-400 hover:scale-110 sm:!basis-1/2 md:!basis-1/5'
            >
              <Link href={item.params.link?.value as Route} className=''>
                <div className='relative'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                    alt={item.title}
                    className='mx-auto h-50 w-50 rounded-full object-cover shadow-2xl'
                  />
                </div>
                <Text size='md' fw={600} className='mt-2 text-center'>
                  {item.title}
                </Text>
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Kontroller */}
        <button
          onClick={() => emblaRef.current?.scrollPrev()}
          className='absolute top-1/2 left-[0px] z-10 -translate-y-1/2 cursor-pointer rounded-full border border-blue-800 bg-white p-3 text-white shadow-xl hover:bg-gray-100 md:left-[-64px]'
          aria-label='Previous'
        >
          <RiArrowLeftLine size={24} className='text-blue-800' />
        </button>

        <button
          onClick={() => emblaRef.current?.scrollNext()}
          className='absolute top-1/2 right-[0px] z-10 -translate-y-1/2 cursor-pointer rounded-full border border-blue-800 bg-white p-3 text-white shadow-xl hover:bg-gray-100 md:right-[-64px]'
          aria-label='Next'
        >
          <RiArrowRightLine size={24} className='text-blue-800' />
        </button>
      </div>
    </div>
  )
}

export { HolidayThemes }
