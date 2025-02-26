import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Image,
  List,
  Rating,
  Skeleton,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { createSerializer } from 'nuqs'
import { FaRegCheckCircle } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'

import {
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
  RoomDetailType,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { hotelDetailSearchParams } from '@/modules/hotel/searchParams'
import { useSearchResultParams } from '@/app/hotel/search-results/useSearchQueries'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo | undefined
  resultItem: HotelSearchResultItemType
  roomDetail: RoomDetailType | undefined
  onMapClick: () => void
}
const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const HotelSearchResultItem: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  roomDetail,
  onMapClick,
}) => {
  const [isImageLoading, setImageLoading] = useState(true)

  const hotelImageUrl =
    hotelInfo?.images.at(0)?.mid ?? hotelInfo?.images.at(0)?.large

  const totalPrice = resultItem.totalPrice.value
  const discountValue = resultItem.discount.value
  const discountedPrice = totalPrice - discountValue
  const totalPriceWithDiscount = totalPrice + discountValue
  const hasDiscount = discountValue > 0 && totalPrice >= discountValue
  const discountRate = Math.round(
    ((totalPriceWithDiscount - totalPrice) / totalPriceWithDiscount) * 100
  )

  const { searchParamsQuery, searchParams } = useSearchResultParams()
  const detailUrl = detailUrlSerializer(`/hotel/${hotelInfo?.slug}`, {
    slug: hotelInfo?.slug,
    productKey: resultItem.key,
    searchToken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
    sessionToken: searchParamsQuery.data?.hotelSearchApiRequest.sessionToken,
    propertyName: hotelInfo?.name,
    hotelSlug: hotelInfo?.slug,
    type: searchParams.type,
  })

  return (
    <>
      <div className='@container'>
        <div className='rounded-lg border border-gray-300 shadow'>
          <span hidden>{resultItem.provider}</span>
          <div className='p-3'>
            <div className='grid gap-3 @2xl:grid-cols-12'>
              <div className='col-span-9 grid gap-3 @2xl:grid-cols-3'>
                <div className='@2xl:col-span-1'>
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
                      fallbackSrc='https://fulltrip.com/Content/images/default-room.jpg'
                      onLoad={(e) => {
                        setImageLoading(false)
                      }}
                      h={'100%'}
                      w={'100%'}
                      src={hotelImageUrl}
                      alt={hotelInfo?.name}
                      radius={'md'}
                    />
                  </Box>
                </div>
                <div className='@2xl:col-span-2'>
                  <Title
                    className='text-md pb-1 @lg:text-lg'
                    order={3}
                    key={resultItem.hotelId}
                  >
                    {hotelInfo?.name}
                  </Title>
                  {hotelInfo?.stars ? (
                    <Rating value={hotelInfo?.stars} readOnly />
                  ) : null}
                  <div className='flex items-center gap-2 text-sm'>
                    <span className='text-gray-600'>
                      {hotelInfo?.destination}
                    </span>
                    <div>|</div>
                    <UnstyledButton
                      fz='inherit'
                      className='text-orange-600 transition-colors hover:text-orange-900'
                      onClick={onMapClick}
                    >
                      Haritada Gör
                    </UnstyledButton>
                  </div>
                  <div className='pt-3'>
                    <List size='sm'>
                      {roomDetail?.pensionType && (
                        <List.Item
                          className='text-green-700'
                          icon={<GiKnifeFork />}
                        >
                          {roomDetail.pensionType}
                        </List.Item>
                      )}
                      {!resultItem.nonRefundable && (
                        <List.Item
                          className='text-green-700'
                          icon={<FaRegCheckCircle />}
                        >
                          Ücretsiz İptal
                        </List.Item>
                      )}
                    </List>
                  </div>
                </div>
              </div>
              <div className='col-span-3 flex flex-col gap-3 self-end @2xl:text-end'>
                {hotelInfo?.comment_info && (
                  <div className=''>
                    <Badge color='green' size='xl'>
                      {hotelInfo?.comment_info?.averageScore}
                    </Badge>
                    <span className='ps-1 text-xs font-semibold text-gray-600'>
                      {hotelInfo?.comment_info?.totalComments} Yorum
                    </span>
                  </div>
                )}
                <div>
                  {hasDiscount && (
                    <>
                      <div className='inline-flex items-center justify-end gap-1 rounded-lg bg-blue-500 p-2 text-end text-sm leading-none font-semibold text-white'>
                        <div className=''>%{discountRate}</div>
                        <small>İndirim</small>
                      </div>
                      <div className='pt-1 pb-2 text-sm text-gray-500 line-through'>
                        {formatCurrency(totalPriceWithDiscount)}
                      </div>
                    </>
                  )}
                  <div className='text-lg font-semibold'>
                    {formatCurrency(totalPrice)}
                  </div>
                </div>

                <div>
                  <Button component={Link} href={detailUrl}>
                    Oda Seç
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { HotelSearchResultItem }
