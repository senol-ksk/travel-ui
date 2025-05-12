'use client'

import { Button, Container, Image, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Link from 'next/link'

const categories = [
  'Erken Rezervasyon',
  'Alanya Otelleri',
  'Kıbrıs Otelleri',
  'Bodrum Otelleri',
  'Belek Otelleri',
  'Kemer Otelleri',
  'başar otelleri',
]

const hotels = [
  {
    name: 'Crystal Family Resort & Spa',
    location: 'Muğla/Bodrum, Turkey',
    price: '2.330₺',
    discount: '%50',
    img: 'https://static.daktilo.com/sites/1222/uploads/2024/08/19/tatil4784515.jpg',
  },
  {
    name: 'La Blanche Island Bodrum',
    location: 'Muğla/Bodrum, Turkey',
    price: '3.200₺',
    img: 'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    name: 'Sueno Hotels Deluxe Belek',
    location: 'Muğla/Bodrum, Turkey',
    price: '2.500₺',
    img: 'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    name: 'Leodikia Kirman Premium',
    location: 'Muğla/Bodrum, Turkey',
    price: '1.500₺',
    img: 'https://static.daktilo.com/sites/1222/uploads/2024/08/19/tatil4784515.jpg',
  },
  {
    name: 'basar otellerı',
    location: 'Muğla/Bodrum, Turkey',
    price: '4.000₺',
    img: 'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    name: 'bılmem ne otellerı',
    location: 'Muğla/Bodrum, Turkey',
    price: '4.20₺',
    img: 'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
]

const HolidayThemes = () => (
  <div className='container-fluid relative pt-10 md:pt-20'>
    <h2 className='mb-3 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
      Tatil Temaları
    </h2>
    <p className='mb-10 text-center text-sm text-gray-600 md:text-base'>
      Tatil planlarına başlamadan önce size fikir verebilecek farklı kriterlere
      göre sınıflandırılmış otellere göz atabilir, detaylı bilgi sahibi
      olabilirsiniz.
    </p>

    <Container className='mb-8'>
      <div className='flex w-max gap-2 overflow-x-auto md:w-auto md:flex-wrap md:justify-center'>
        {categories.map((title, i) => (
          <Link href='#' key={i}>
            <Button
              variant='default'
              size='md'
              radius='md'
              className='whitespace-nowrap'
            >
              {title}
            </Button>
          </Link>
        ))}
      </div>
    </Container>

    <Container>
      <Carousel slideGap='lg' slideSize='100%' className='relative mb-10'>
        {hotels.map((hotel, i) => (
          <Carousel.Slide
            key={i}
            className='!basis-full sm:!basis-1/2 md:!basis-1/5'
          >
            <Link href='#'>
              <div className='relative'>
                <Image
                  src={hotel.img}
                  alt={hotel.name}
                  className='mx-auto h-50 w-50 rounded-full object-cover shadow-lg'
                />
              </div>
              <Text size='md' fw={600} className='mt-2 text-center'>
                {hotel.name}
              </Text>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>

      <div className='mt-5 text-center md:mt-10'>
        <Button variant='filled' size='md' radius='xl'>
          Tümünü Gör
        </Button>
      </div>
    </Container>
  </div>
)

export { HolidayThemes }
