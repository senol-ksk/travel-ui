import {
  TourSearchResultGroupedItem,
  TourSearchResultRelatedItems,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import {
  AspectRatio,
  Badge,
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
import { IoLocationSharp } from 'react-icons/io5'
import { MdOutlineChevronRight } from 'react-icons/md'
import { useQueryStates } from 'nuqs'
import { tourSearchResultParamParser } from '@/modules/tour/searchResultParams'

type Props = {
  // data: TourSearchResultSearchItem
  data: TourSearchResultGroupedItem
}
export const TourSearchResultItem: React.FC<Props> = ({ data }) => {
  const [searchParams] = useQueryStates(tourSearchResultParamParser)

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
    isCruise: searchParams.isCruise,
  })
  return (
    <div className='grid grid-cols-1 rounded-md border border-gray-300 shadow md:grid-cols-5'>
      <div className='grid gap-3 p-3 md:col-span-4 md:gap-5'>
        <div className='grid grid-cols-12 items-start gap-4'>
          <div className='col-span-12 md:col-span-5'>
            <Box className='relative'>
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
                  mah={230}
                  loading='lazy'
                  src={data.imageUrl}
                  alt={data.title}
                  radius={'md'}
                  onLoad={() => {
                    setImageLoading(false)
                  }}
                />
              </AspectRatio>
              <div className='absolute start-0 end-0 top-0 bottom-0 m-2 rounded-md'>
                <Badge className='bg-orange-800 p-3 text-white opacity-90 shadow-lg'>
                  Son {selectedTour.quota} kişi
                </Badge>
              </div>
            </Box>
          </div>
          <div className='col-span-12 flex flex-col gap-3 md:col-span-7'>
            <Title order={3} className='text-md font-semibold lg:text-lg'>
              {data.region.title}
            </Title>
            <div className='flex gap-2 text-sm'>
              <span>
                <LiaInfoCircleSolid size={20} className='text-blue-800' />
              </span>
              {data.description}
            </div>

            <div className='flex gap-2 text-sm text-gray-700'>
              <div>
                <IoLocationSharp size={20} className='text-blue-800' />
              </div>
              <div>{data.title}</div>
            </div>

            <div>
              <TourDropdown
                data={sortedRelatedItems}
                onSelect={setSelectedTour}
                defaultItem={selectedTour}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between gap-3 p-3 md:col-span-1 md:flex-col md:items-end md:justify-end md:border-l md:text-end'>
        <div className='leading-tight lg:col-span-6'>
          <small>
            {formatCurrency(
              selectedTour.totalPrice.value,
              selectedTour.totalPrice.currency ?? 'TRY'
            )}
          </small>
          <div className='text-2xl font-semibold'>
            {formatCurrency(selectedTour.tlPrice.value)}
          </div>
        </div>
        <div className='md:w-full'>
          <Button
            className='text-lg'
            radius={'md'}
            component={Link}
            href={detailUrl}
            rightSection={<MdOutlineChevronRight size={18} />}
            fullWidth
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}
