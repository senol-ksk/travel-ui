import { TourSearchResultSearchItem } from '@/modules/tour/type'
import {
  Box,
  Button,
  Divider,
  Image,
  Skeleton,
  Title,
  Transition,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { HiOutlineCalendarDays } from 'react-icons/hi2'

import { formatCurrency } from '@/libs/util'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useTourSearchResultsQuery } from './useSearhResults'
import dayjs from 'dayjs'
import { useState } from 'react'

type Props = {
  data: TourSearchResultSearchItem
  providerName?: string
  onClick?: (tour: TourSearchResultSearchItem) => void
}
export const TourSearchResultItem: React.FC<Props> = ({
  data,
  providerName,
  onClick = () => null,
}) => {
  const { searchParamsQuery } = useTourSearchResultsQuery()
  const [isImageLoading, setImageLoading] = useState(true)

  const detailUrl = serializeTourDetailPageParams('/tour/detail', {
    productKey: data.key,
    slug: data.slug,
    searchToken: searchParamsQuery.data?.data?.params.searchToken,
    sessionToken: searchParamsQuery.data?.data?.sessionToken,
  })

  return (
    <div className='@container rounded-lg border border-gray-300'>
      <div className='grid gap-3 p-3 md:gap-5 @lg:p-5'>
        <Title order={3} className='text-md font-semibold @lg:text-lg'>
          {data.title}{' '}
          <small className='text-xs text-gray-300'>{providerName}</small>
        </Title>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-3'>
            <Box h={200} className='relative'>
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
              <Image
                loading='lazy'
                src={data.imageUrl}
                alt={data.title}
                radius={'md'}
                onLoad={() => {
                  setImageLoading(false)
                }}
              />
            </Box>
          </div>
          <div className='col-span-12 md:col-span-9'>
            <div className='font-semibold'>{data.description}</div>
            <div className='flex items-center gap-2'>
              <div>
                <HiOutlineCalendarDays size={22} />
              </div>
              <div>{dayjs(data.startDate).format('DD MMMM YYYY')}</div>
              <div>{'-'}</div>
              <div>{dayjs(data.endDate).format('DD MMMM YYYY')}</div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className='grid grid-cols-1 items-end justify-between gap-3 p-3 lg:p-5 @lg:grid-cols-7'>
        <div className='leading-tight @lg:col-span-6'>
          <small className='text-gray-600'>
            {formatCurrency(
              data.totalPrice.value,
              data.totalPrice.currency ?? 'TRY'
            )}
          </small>
          <div className='text-lg font-semibold'>
            {formatCurrency(data.tlPrice.value)}
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
