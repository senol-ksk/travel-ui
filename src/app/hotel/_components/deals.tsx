'use client'

import { HotelLandingWidgets } from '@/types/cms-types'
import { Carousel } from '@mantine/carousel'
import { Box } from '@mantine/core'
import { Link } from 'next-view-transitions'

type IProps = { widgets: HotelLandingWidgets[] }

const HotelDeals: React.FC<IProps> = ({ widgets }) => {
  return (
    <Carousel
      slideGap={'md'}
      slideSize={{
        base: '100%',
        sm: '50%',
        md: '20%',
      }}
    >
      {widgets.map((deal) => (
        <Carousel.Slide key={deal.id}>
          <Box component={Link} href={deal.params.link.value}>
            {deal.title}
          </Box>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export { HotelDeals }
