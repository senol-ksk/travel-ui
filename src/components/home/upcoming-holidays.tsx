'use client'

import { Carousel } from '@mantine/carousel'
import { BackgroundImage, Badge, Box, Container } from '@mantine/core'
import Link from 'next/link'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'
type IProps = {
  data: Widgets
}

const UpComingHolidays: React.FC<IProps> = ({ data }) => {
  return (
    <Container className='flex flex-col items-center'>
      <div className='mb-5 text-center text-3xl font-bold text-blue-900'>
        Yaklaşan Tatiller
      </div>
      <Carousel slideGap='lg' withIndicators className='w-full'>
        {data.map((item) => (
          <Carousel.Slide
            key={item.id}
            className='!basis-full sm:!basis-1/2 md:!basis-1/3'
          >
            <Link href={item.params.link?.value || '#'} className='p-3'>
              <div className='group relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105'>
                <BackgroundImage
                  src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                  className='h-full w-full object-cover brightness-75 transition-all duration-300 group-hover:brightness-100'
                />
                <div className='absolute bottom-35 w-full text-center text-2xl font-extrabold break-words text-white'>
                  {item.title}
                </div>
                {item.params.btn_text?.value.length > 0 && (
                  <Badge
                    color='white'
                    className='absolute bottom-10 left-1/2 mb-5 -translate-x-1/2 transform p-4 text-black'
                    radius='lg'
                    size='xs'
                  >
                    {item.params.btn_text?.value}
                  </Badge>
                )}
              </div>
              <Badge
                color='white'
                className='absolute top-10 -left-0 transform bg-orange-700 p-3 text-white'
                radius='md'
                size='xs'
              >
                %30 indirim
              </Badge>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Container>
  )
}
export { UpComingHolidays }
