import { AspectRatio, Button, Title, Box, Image, Badge } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Link } from 'next-view-transitions'

import { Widgets } from '@/types/cms-types'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { cdnImageUrl } from '@/libs/cms-data'
import { Route } from 'next'

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
      {data?.map((item) => {
        const mainPrice = Number(
          item.params.price.value
            .replace('₺', '')
            .trim()
            .replace(/\./g, '')
            .replace(',', '.')
        )
        const discPrice = Number(
          item.params.discount_price.value
            .replace('₺', '')
            .trim()
            .replace(/\./g, '')
            .replace(',', '.')
        )
        const discedPrice = ((mainPrice - discPrice) / mainPrice) * 100

        return (
          <CarouselSlide key={item.id}>
            <Box
              href={
                `/hotel/${item.params.link?.value.split('/').at(-1)}?slug=${item.params.link?.value.split('/').at(-1)}` as Route
              }
              component={Link}
              className='group block h-full w-full gap-3'
            >
              <Box className='group mb-10 w-full rounded-xl bg-white shadow-xl'>
                <div className='relative'>
                  <AspectRatio>
                    <Image
                      src={cdnImageUrl(item.params.image?.value)}
                      alt={item.title}
                      className='rounded-t-xl'
                    />
                  </AspectRatio>
                  {item.params.discount_price?.value &&
                    item.params.price?.value &&
                    mainPrice > 0 &&
                    discPrice > 0 && (
                      <Badge
                        size='lg'
                        radius={'md'}
                        className='absolute top-2 left-3 bg-orange-500'
                      >
                        %{discedPrice.toFixed(0)} indirim
                      </Badge>
                    )}
                  {item.params.tag.value && (
                    <Badge
                      size='lg'
                      radius={'md'}
                      className={`absolute left-3 bg-blue-900 font-normal ${
                        item.params.discount_price?.value &&
                        item.params.price?.value &&
                        mainPrice > 0 &&
                        discPrice > 0
                          ? 'top-10'
                          : 'top-2'
                      }`}
                    >
                      {item.params.tag.value}
                    </Badge>
                  )}
                </div>
                <div className='-mt-xl relative z-10 grid gap-3 rounded-xl border border-t-5 border-t-transparent bg-white p-5 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                  <Title order={3} fz='md' lineClamp={1}>
                    {item.title}
                  </Title>
                  <p className='text-xs text-gray-900'>
                    {item.params.location?.value}
                  </p>
                  <div className='flex items-center justify-between pt-5'>
                    <p className='text-xl font-bold'>
                      {item.params.discount_price?.value}
                      <span className='text-sm font-normal'> / Kişi</span>
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
            </Box>
          </CarouselSlide>
        )
      })}
    </Carousel>
  )
}
export { RecommendedProducts }
