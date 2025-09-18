import { AspectRatio, Title, Box, Image, Badge, Button } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Link } from 'next-view-transitions'

import { Widgets } from '@/types/cms-types'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { cdnImageUrl } from '@/libs/cms-data'
import { Route } from 'next'
type IProps = {
  data: Widgets
}

export const HomeTourDom: React.FC<IProps> = ({ data }) => {
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
        return (
          <CarouselSlide key={item.id}>
            <Box
              href={
                `tour/${item.params.link?.value.split('/').at(-1)}` as Route
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

                  {item.params.tag.value && (
                    <Badge
                      size='lg'
                      radius={'md'}
                      className='absolute top-4 left-3 bg-blue-900 font-normal'
                    >
                      {item.params.tag.value}
                    </Badge>
                  )}
                </div>
                <div className='-mt-xl relative z-10 grid h-35 gap-3 rounded-xl border border-t-5 border-t-transparent bg-white p-5 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                  <Title order={3} fz='md' lineClamp={1}>
                    {item.title}
                  </Title>
                  <div className='items-end justify-between'>
                    <div className='flex items-end justify-between'>
                      <div>
                        <p className='text-sm font-bold text-gray-600 line-through'>
                          {item.params.price?.value}
                        </p>
                        <p className='text-xl font-bold'>
                          <span
                            className={
                              item.params.discount_price.value &&
                              item.params.discount_price?.value !== '0' &&
                              item.params.discount_price?.value.length > 0
                                ? 'text-red-800'
                                : 'text-green-800'
                            }
                          >
                            {item.params.discount_price?.value}
                          </span>
                        </p>
                      </div>
                      <Button
                        className='transition-all ease-linear group-hover:bg-blue-800 group-hover:text-white'
                        variant='light'
                        color='blue'
                        size='sm'
                        radius='xl'
                      >
                        İncele
                      </Button>
                    </div>
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
