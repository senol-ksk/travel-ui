'use client'

import { Carousel } from '@mantine/carousel'
import { BackgroundImage, Badge, Box } from '@mantine/core'

const defaultData = [
  {
    id: '1',
    title: 'Kurban Bayramı Geliyor!',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    id: '2',
    title: 'Önce 19 Mayıs',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    id: '3',
    title: '23 Nisan Geçti!',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    id: '4',
    title: 'Buralar Cmstn Gelecek',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    id: '5',
    title: '20 Ağustos Çok Özel',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
  {
    id: '6',
    title: 'Yılbaşı Daha Geçen Aydı',
    image:
      'https://c.ekstatic.net/ecl/explore-destination/beach/beach-view-with-clear-blue-water-lp-w1920x480.jpg',
  },
]

const UpComingHolidays: React.FC = () => {
  return (
    <div className='flex flex-col items-center py-10 md:py-20'>
      <div className='mb-5 text-center text-3xl font-bold text-blue-900'>
        Yaklaşan Tatiller
      </div>
      <Carousel slideGap='lg' withIndicators className='w-full max-w-[1200px]'>
        {defaultData.map((item) => (
          <Carousel.Slide
            key={item.id}
            className='!basis-full sm:!basis-1/2 md:!basis-1/3'
          >
            <Box className='p-3'>
              <div className='group relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105'>
                <BackgroundImage
                  src={item.image}
                  className='h-full w-full object-cover brightness-75 transition-all duration-300 group-hover:brightness-100'
                />
                <div className='absolute bottom-35 w-full text-center text-2xl font-extrabold break-words text-white'>
                  {item.title}
                </div>
                <Badge
                  color='white'
                  className='absolute bottom-10 left-1/2 mb-5 -translate-x-1/2 transform p-4 text-black'
                  radius='lg'
                  size='xs'
                >
                  Rezervasyon Yap
                </Badge>
              </div>
              <Badge
                color='white'
                className='absolute top-5 -left-0 transform bg-orange-700 p-3 text-white'
                radius='md'
                size='xs'
              >
                %30 indirim
              </Badge>
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}
export { UpComingHolidays }
