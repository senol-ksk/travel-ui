import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { Button, Divider, Image, Title } from '@mantine/core'
import { Link } from 'next-view-transitions'

import { formatCurrency } from '@/libs/util'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useTourSearchResultsQuery } from './useSearhResults'

type Props = {
  data: TourSearchResultSearchItem
  onClick?: (tour: TourSearchResultSearchItem) => void
}
export const TourSearchResultItem: React.FC<Props> = ({
  data,
  onClick = () => null,
}) => {
  const { searchParamsQuery } = useTourSearchResultsQuery()

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
          {data.title}
        </Title>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-3'>
            <Image src={data.imageUrl} alt={data.title} radius={'md'} />
          </div>
          <div className='col-span-12 md:col-span-9'>{data.description}</div>
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
