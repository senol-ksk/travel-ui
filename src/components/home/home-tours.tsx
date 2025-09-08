import { AspectRatio, Title, Box, Image, Badge } from '@mantine/core'
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
                  {item.params.discount_price?.value && (
                    <Badge
                      size='lg'
                      radius={'md'}
                      className='absolute top-2 left-3 bg-orange-500'
                    >
                      %{discedPrice} indirim
                    </Badge>
                  )}
                  {item.params.tag.value && (
                    <Badge
                      size='lg'
                      radius={'md'}
                      className='absolute top-10 left-3 bg-blue-900 font-normal'
                    >
                      {item.params.tag.value}
                    </Badge>
                  )}
                </div>
                <div className='-mt-xl relative z-10 grid gap-3 rounded-xl border border-t-5 border-t-transparent bg-white px-5 py-3 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                  <Title order={3} fz='md' lineClamp={1}>
                    {item.title}
                  </Title>
                  <div className='items-end justify-between'>
                    <div>
                      <p className='text-sm font-bold text-gray-600 line-through'>
                        {item.params.price?.value}₺
                      </p>
                      <p className='text-xl font-bold'>
                        <span className='text-red-800'>
                          {item.params.discount_price?.value}₺
                        </span>
                        <span className='text-sm font-normal'>
                          {' '}
                          &apos;den itibaren
                        </span>
                      </p>
                    </div>
                    <p className='text-xs text-gray-600'>
                      Çift kişilik odada kişi başı fiyatlarıdır.
                    </p>
                    efendi
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
