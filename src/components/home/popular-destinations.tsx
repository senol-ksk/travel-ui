'use client'

import { Button, Container, Image, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Link from 'next/link'
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

const PopularDestinations: React.FC<IProps> = ({ data }) => {
  const [isEmblaInitialized, setIsEmblaInitialized] = useState(false)

  useEffect(() => {
    setIsEmblaInitialized(true)
  }, [])
  return (
    <div className='container-fluid relative'>
      <h2 className='mb-3 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
        Popüler Şehirler
      </h2>

      {/* <Container>
        <Carousel slideGap='lg' slideSize='100%' className='relative mb-10'>
          {data?.map((item) => (
            <Carousel.Slide
              key={item.id}
              className='!basis-full sm:!basis-1/2 md:!basis-1/5'
            >
              <Link href={item.params.link?.value || '#'}>
                <div className='relative'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                    alt={item.title}
                    className='mx-auto h-50 w-50 rounded-full object-cover shadow-lg'
                  />
                </div>
                <Text size='md' fw={600} className='mt-2 text-center'>
                  {item.title}
                </Text>
              </Link>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container> */}
    </div>
  )
}

export { PopularDestinations }
