'use client'

import { Button, Container } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Badge, Box } from '@mantine/core'
import Link from 'next/link'
import { Image } from '@mantine/core'
import { Widgets } from '@/types/cms-types'
import React from 'react'

const categories = [
  'Erken Rezervasyon',
  'Alanya Otelleri',
  'Kıbrıs Otelleri',
  'Bodrum Otelleri',
  'Belek Otelleri',
  'Kemer Otelleri',
  'başar otelleri',
]

type IProps = {
  data: Widgets
}

const LastOpportunity: React.FC<IProps> = ({ data }) => {
  return (
    <div className='container-fluid relative py-10 md:py-20'>
      <div
        className='absolute inset-0 bg-cover bg-center brightness-75'
        style={{
          backgroundImage:
            "url('https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg')",
          zIndex: -1,
        }}
      />
      <h2 className='mb-6 text-center text-2xl font-bold text-white md:text-3xl'>
        Son Dakika Fırsatları
      </h2>

      <Container className='mb-8 gap-2 overflow-x-auto md:overflow-x-visible'>
        <div className='flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center'>
          {data.map((item, i) => (
            <Link href='#' key={i}>
              <Button
                className='cursor-pointer whitespace-nowrap'
                variant='default'
                color='white'
                size='md'
                radius='md'
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </Container>
      <Container>
        <Carousel slideGap='lg' className='relative' slideSize='100%'>
          {data.map((item, i) => (
            <Carousel.Slide
              key={i}
              className='!basis-full gap-4 sm:!basis-1/2 md:!basis-1/4'
            >
              <Link href={item.params.link?.value || '#'}>
                <Box className='group w-full rounded-lg bg-white shadow-xl'>
                  <div className='relative'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                      alt={item.title}
                      className='h-60 w-full rounded-lg object-cover brightness-75 transition-all duration-300 group-hover:brightness-100'
                    />

                    {item.params.discount_price && (
                      <span className='absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs text-white'>
                        {item.params.discount_price?.value}
                      </span>
                    )}
                  </div>
                  <div className='grid gap-3 p-5'>
                    <h3 className='text-md font-semibold'>{item.title}</h3>
                    <p className='text-xs text-gray-900'>
                      {item.params.location.value}
                    </p>
                    <div className='flex items-center justify-between pt-5'>
                      <p className='text-md font-bold'>
                        {item.params.price?.value}
                        <span className='text-sm font-normal'>/ Kişi</span>
                      </p>
                      <Button
                        variant='light'
                        color='blue'
                        size='sm'
                        radius='xl'
                      >
                        {item.params.btn_text?.value}
                      </Button>
                    </div>
                  </div>
                </Box>
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </div>
  )
}

export { LastOpportunity }
