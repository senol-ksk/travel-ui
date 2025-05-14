'use client'

import { Button, Container } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Badge, Box } from '@mantine/core'
import Link from 'next/link'
import { Image } from '@mantine/core'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'

type IProps = {
  data: Widgets
}

const categories = [
  'Erken Rezervasyon',
  'Alanya Otelleri',
  'Kıbrıs Otelleri',
  'Bodrum Otelleri',
  'Belek Otelleri',
  'Kemer Otelleri',
  'başar otelleri',
]

const RecommendedProducts: React.FC<IProps> = ({ data }) => {
  const [isEmblaInitialized, setIsEmblaInitialized] = useState(false)

  useEffect(() => {
    setIsEmblaInitialized(true)
  }, [])

  return (
    <div className='relative'>
      <h2 className='mb-6 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
        Tavsiye Ettiğimiz Oteller
      </h2>

      <Container className='mb-8 gap-2 overflow-x-auto md:overflow-x-visible'>
        <div className='flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center'>
          {categories.map((title, i) => (
            <Link href='#' key={i}>
              <Button
                className='cursor-pointer whitespace-nowrap'
                variant='default'
                color='white'
                size='md'
                radius='md'
              >
                {title}
              </Button>
            </Link>
          ))}
        </div>
      </Container>
      <Container>
        <Carousel slideGap='lg' className='relative' slideSize='100%'>
          {data?.map((item) => (
            <Carousel.Slide
              key={item.id}
              className='!basis-full gap-4 sm:!basis-1/2 md:!basis-1/4'
            >
              <Link href={item.params.link?.value || '#'}>
                <Box className='group mb-10 w-full rounded-lg border bg-white shadow-xl'>
                  <div className='relative'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                      alt={item.title}
                      className='h-60 w-full rounded-lg object-cover brightness-75 transition-all duration-300 group-hover:brightness-100'
                    />
                    {item.params.discount_price?.value && (
                      <span className='absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs text-white'>
                        %{item.params.discount_price.value}
                      </span>
                    )}
                  </div>
                  <div className='grid gap-3 p-5'>
                    <h3 className='text-md font-semibold'>{item.title}</h3>
                    <p className='text-xs text-gray-900'>
                      {item.params.location?.value}
                    </p>
                    <div className='flex items-center justify-between pt-5'>
                      <p className='text-md font-bold'>
                        {item.params.discount_price?.value}
                        <span className='text-sm font-normal'>/ Kişi</span>
                      </p>
                      <Button
                        variant='light'
                        color='blue'
                        size='sm'
                        radius='xl'
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

export { RecommendedProducts }
