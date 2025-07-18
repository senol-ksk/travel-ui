import { AspectRatio, Button, Title, Box, Image } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Link } from 'next-view-transitions'

import { Widgets } from '@/types/cms-types'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { cdnImageUrl } from '@/libs/cms-data'

type IProps = {
  data: Widgets
}

const RecommendedProducts: React.FC<IProps> = ({ data }) => {
  return (
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
      {data?.map((item) => (
        <CarouselSlide key={item.id}>
          <Box
            href={`/hotel/${item.params.link?.value.split('/').at(-1)}?slug=${item.params.link?.value.split('/').at(-1)}`}
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
        </CarouselSlide>
      ))}
    </Carousel>
  )
}
export { RecommendedProducts }
