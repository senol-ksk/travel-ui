'use client'

import { Button, Container } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Badge, Box } from '@mantine/core'
import Link from 'next/link'
import { Image } from '@mantine/core'

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

const LastOpportunity = () => {
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
          {hotels.map((hotel, i) => (
            <Carousel.Slide
              key={i}
              className='!basis-full gap-4 sm:!basis-1/2 md:!basis-1/4'
            >
              <Box className='w-full rounded-lg bg-white shadow-xl'>
                <div className='relative'>
                  <Image
                    src={hotel.img}
                    alt={hotel.name}
                    className='h-60 w-full rounded-lg object-cover'
                  />
                  {hotel.discount && (
                    <span className='absolute top-2 right-2 rounded bg-orange-500 px-2 py-1 text-xs text-white'>
                      {hotel.discount}
                    </span>
                  )}
                </div>
                <div className='p-5'>
                  <h3 className='text-sm font-semibold'>{hotel.name}</h3>
                  <p className='text-xs text-gray-500'>{hotel.location}</p>
                  <div className='flex items-center justify-between pt-5'>
                    <p className='text-md font-bold'>
                      {hotel.price}{' '}
                      <span className='text-sm font-normal'>/ Kişi</span>
                    </p>
                    <Button
                      variant='outline'
                      color='blue'
                      size='xs'
                      radius='md'
                    >
                      İncele
                    </Button>
                  </div>
                </div>
              </Box>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Container>
    </div>
  )
}

export { LastOpportunity }
