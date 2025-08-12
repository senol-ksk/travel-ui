'use client'

import { AspectRatio, Button } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Box } from '@mantine/core'
import Link from 'next/link'
import { Image } from '@mantine/core'
import { TourDealType } from '@/types/cms-types'
import { formatCurrency, slugify, validateUrl } from '@/libs/util'
import { cdnSiteImageUrl } from '@/libs/cms-data'
import dayjs from 'dayjs'
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri'
type IProps = {
  data: TourDealType[]
}

const TourOpportunity: React.FC<IProps> = ({ data }) => {
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
      {data.map((tour) => {
        const {
          imagePath,
          id,
          title,
          subDealId,
          subTitle,
          productKey,
          startDate,
          price,
          promotionText,
        } = tour
        const href = `/tour/detail?slug=${slugify(title.toLocaleLowerCase())}-${subDealId}&productKey=${productKey}`
        return (
          <Carousel.Slide key={id}>
            <Box
              href={href}
              component={Link}
              className='group block h-full w-full gap-3'
            >
              <Box className='group mb-10 w-full rounded-xl bg-white shadow-xl'>
                <div className='relative'>
                  <AspectRatio>
                    <Image
                      src={
                        validateUrl(imagePath)
                          ? imagePath
                          : cdnSiteImageUrl(imagePath)
                      }
                      alt={title}
                      className='rounded-t-xl'
                    />
                  </AspectRatio>
                  {promotionText && (
                    <span className='absolute top-3 left-3 rounded-lg bg-blue-800 px-2 py-1 text-xs text-white'>
                      {promotionText}
                    </span>
                  )}
                </div>
                <div className='-mt-xl relative z-10 grid gap-3 rounded-xl border border-t-5 border-t-transparent bg-white p-5 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                  <div className='grid gap-3'>
                    <h3 className='text-md truncate font-semibold'>{title}</h3>
                    <p className='text-xs'>
                      {dayjs(startDate).format('YYYY DD MMM ddd ')}
                    </p>
                    <p className='truncate text-xs text-gray-900'>{subTitle}</p>
                    <div className='flex items-center justify-between pt-5'>
                      <p className='text-red text-xl font-bold'>
                        {formatCurrency(price)}
                      </p>
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
          </Carousel.Slide>
        )
      })}
    </Carousel>
  )
}

export { TourOpportunity }
