'use client'

import { Carousel } from '@mantine/carousel'
import { BackgroundImage, Badge, Box, Container } from '@mantine/core'
import Link from 'next/link'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
type IProps = {
  data: Widgets
}

const UpComingHolidays: React.FC<IProps> = ({ data }) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-5 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
        Yaklaşan Tatiller
      </div>
      <Carousel
        slideGap='lg'
        withIndicators
        controlSize={42}
        className='w-full'
        nextControlIcon={
          <div className='text-blue-800'>
            <RiArrowRightLine size={24} />
          </div>
        }
        previousControlIcon={
          <div className='text-blue-800'>
            <RiArrowLeftLine size={24} />
          </div>
        }
      >
        {data.map((item) => (
          <Carousel.Slide
            key={item.id}
            className='!basis-full sm:!basis-1/2 md:!basis-1/3'
          >
            <Link href={item.params.link?.value || '#'} className='p-3'>
              <div className='group relative aspect-[1/1] w-full overflow-hidden rounded-lg shadow-md'>
                <BackgroundImage
                  src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                  className='h-full w-full object-cover brightness-80 transition-all duration-300 group-hover:brightness-100'
                />
                <div className='absolute bottom-16 w-full text-center text-2xl font-bold break-words text-white'>
                  {item.title}
                </div>
                {item.params.btn_text?.value.length > 0 && (
                  <Badge
                    color='white'
                    className='absolute bottom-0 left-1/2 mb-5 -translate-x-1/2 transform cursor-pointer p-4 text-black'
                    radius='lg'
                    size='sm'
                  >
                    {item.params.btn_text?.value}
                  </Badge>
                )}
              </div>
              <Badge
                color='white'
                className='absolute top-10 left-2 transform bg-orange-700 p-3 text-white'
                radius='md'
                size='lg'
              >
                %30 indirim
              </Badge>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}
export { UpComingHolidays }
