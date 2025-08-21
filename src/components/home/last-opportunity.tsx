'use client'

import { AspectRatio, Button, Container, Title } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Box } from '@mantine/core'
import Link from 'next/link'
import { Image } from '@mantine/core'
import { Widgets } from '@/types/cms-types'
import React from 'react'
import { cdnImageUrl } from '@/libs/cms-data'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { Route } from 'next'

type IProps = {
  data: Widgets
}

const LastOpportunity: React.FC<IProps> = ({ data }) => {
  return (
    <div className='container-fluid relative pt-3 pb-5'>
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

      <Container className='mb-5 gap-2 overflow-x-auto md:overflow-x-visible'>
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
        <Carousel
          slideGap='lg'
          slideSize={{ base: '100%', sm: `${100 / 4}%` }}
          controlSize={48}
          emblaOptions={{
            dragFree: true,
          }}
          controlsOffset={0}
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
          {data.map((item, i) => (
            <Carousel.Slide
              key={i}
              className='!basis-full gap-4 sm:!basis-1/2 md:!basis-1/4'
            >
              <Link href={item.params.link?.value as Route}>
                <Box
                  href={
                    `/hotel/${item.params.link?.value.split('/').at(-1)}?slug=${item.params.link?.value.split('/').at(-1)}` as Route
                  }
                  component={Link}
                  className='group block h-full w-full'
                >
                  <div className='relative'>
                    <AspectRatio>
                      <Image
                        src={cdnImageUrl(item.params.image?.value)}
                        alt={item.title}
                        className='rounded-t-xl'
                      />
                    </AspectRatio>

                    {item.params.discount_price?.value && (
                      <span className='absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs text-white'>
                        %{item.params.discount_price.value}
                      </span>
                    )}
                  </div>
                  <div className='-top-xl relative z-10 grid gap-3 rounded-xl border border-t-5 border-t-transparent bg-white p-5 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                    <Title order={3} fz='md' lineClamp={1}>
                      {item.title}
                    </Title>
                    <p className='text-xs text-gray-900'>
                      {item.params.location?.value}
                    </p>
                    <div className='flex items-center justify-between pt-5'>
                      <p className='text-md font-bold'>
                        {item.params.discount_price?.value}
                        <span className='text-sm font-normal'>/ Kişi</span>
                      </p>
                      <Button
                        component='div'
                        variant='light'
                        color='blue'
                        size='sm'
                        radius='xl'
                        className='transition-all ease-linear group-hover:bg-blue-800 group-hover:text-white'
                      >
                        İncele
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
