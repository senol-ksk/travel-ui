import {
  TourSearchResultGroupedItem,
  TourSearchResultRelatedItems,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Image,
  Select,
  Skeleton,
  Title,
  Transition,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { HiOutlineCalendarDays } from 'react-icons/hi2'
import { LiaInfoCircleSolid } from 'react-icons/lia'

import { formatCurrency } from '@/libs/util'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearchResults'
import dayjs from 'dayjs'
import { useState } from 'react'
import { TourDropdown } from './_components/dropdown'

type Props = {
  // data: TourSearchResultSearchItem
  data: TourSearchResultGroupedItem
}
export const TourSearchResultItem: React.FC<Props> = ({ data }) => {
  const sortedRelatedItems = data.relatedItems.sort((a, b) =>
    dayjs(a.startDate).diff(b.startDate)
  )
  const { searchParamsQuery } = useTourSearchResultsQuery()
  const [isImageLoading, setImageLoading] = useState(true)
  const [selectedTour, setSelectedTour] = useState<TourSearchResultSearchItem>(
    sortedRelatedItems[0]
  )

  const detailUrl = serializeTourDetailPageParams('/tour/detail', {
    productKey: selectedTour.key,
    slug: selectedTour.slug,
    searchToken: searchParamsQuery.data?.data?.params.searchToken,
    sessionToken: searchParamsQuery.data?.data?.sessionToken,
  })

  return (
    <div className='rounded-md border border-gray-300 shadow'>
      <div className='grid gap-3 p-3 md:gap-5 lg:p-5'>
        <Title order={3} className='text-md font-semibold lg:text-lg'>
          {data.region.title}
        </Title>
        <div className='grid grid-cols-12 items-start gap-4'>
          <div className='col-span-12 md:col-span-3'>
            <Box
              // h={150}
              className='relative'
            >
              <Transition
                mounted={isImageLoading}
                transition='fade'
                duration={400}
                timingFunction='ease'
              >
                {(styles) => (
                  <div
                    style={styles}
                    className='absolute start-0 end-0 top-0 bottom-0 rounded-md border bg-white p-2 transition-opacity duration-300'
                  >
                    <Skeleton className='size-full' radius={'md'} />
                  </div>
                )}
              </Transition>
              <AspectRatio>
                <Image
                  loading='lazy'
                  src={data.imageUrl}
                  alt={data.title}
                  radius={'md'}
                  onLoad={() => {
                    setImageLoading(false)
                  }}
                />
              </AspectRatio>
            </Box>
          </div>
          <div className='col-span-12 grid gap-1 md:col-span-9'>
            <div className='pb-3 font-semibold'>{data.description}</div>

            <div className='flex gap-2 text-sm text-gray-700'>
              <div>
                <LiaInfoCircleSolid size={22} />
              </div>
              <div>{data.title}</div>
            </div>

            <TourDropdown
              data={sortedRelatedItems}
              onSelect={setSelectedTour}
              defaultItem={selectedTour}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className='grid grid-cols-1 items-end justify-between gap-3 p-3 lg:grid-cols-7 lg:p-5'>
        <div className='leading-tight lg:col-span-6'>
          <small className='text-gray-600'>
            {formatCurrency(
              selectedTour.totalPrice.value,
              selectedTour.totalPrice.currency ?? 'TRY'
            )}
          </small>
          <div className='text-lg font-semibold'>
            {formatCurrency(selectedTour.tlPrice.value)}
          </div>
        </div>
        <div>
          <Button
            component={Link}
            href={detailUrl}
            // onClick={() => onClick(data)}

            fullWidth
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}
