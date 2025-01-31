import { useState } from 'react'
import { Box, Button, Image, Skeleton, Title, Transition } from '@mantine/core'
import { Link } from 'next-view-transitions'
import {
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { createSerializer } from 'nuqs'
import { hotelDetailSearchParams } from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './useSearchQueries'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo
  resultItem: HotelSearchResultItemType
  onSelect?: ({
    hotelInfo,
    resultItem,
  }: {
    hotelInfo: HotelSearchResultHotelInfo
    resultItem: HotelSearchResultItemType
  }) => void
}
const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const HotelSearchResultItem: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  onSelect = () => null,
}) => {
  const [isImageLoading, setImageLoading] = useState(true)

  const hotelImageUrl =
    hotelInfo.images.at(0)?.mid ?? hotelInfo.images.at(0)?.large

  const totalPrice = resultItem.totalPrice.value
  const discountValue = resultItem.discount.value
  const discountedPrice = totalPrice - discountValue
  const totalPriceWithDiscount = totalPrice + discountValue
  const hasDiscount = discountValue > 0 && totalPrice >= discountValue
  const discountRate = Math.round(
    ((totalPriceWithDiscount - totalPrice) / totalPriceWithDiscount) * 100
  )

  const { searchParamsQuery, searchParams } = useSearchResultParams()
  const detailUrl = detailUrlSerializer(`/hotel/${hotelInfo.slug}`, {
    slug: hotelInfo.slug,
    productKey: resultItem.key,
    searchToken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
    sessionToken: searchParamsQuery.data?.hotelSearchApiRequest.sessionToken,
    propertyName: hotelInfo.name,
    hotelSlug: hotelInfo.slug,
    type: searchParams.type,
  })

  return (
    <div className='@container'>
      <div className='rounded-lg border border-gray-300'>
        {/* <TextInput value={JSON.stringify(hotelInfo)} readOnly />
        <TextInput value={JSON.stringify(resultItem)} readOnly /> */}
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
                    alt={hotelInfo.name}
                    radius={'md'}
                  />
                </Box>
              </div>
              <div className='@2xl:col-span-2'>
                <Title
                  className='text-md pb-4 @lg:text-lg'
                  order={3}
                  key={resultItem.hotelId}
                >
                  {hotelInfo.name}
                </Title>
                {!resultItem.nonRefundable && (
                  <div className='text-green-500'>Ücretsiz İptal</div>
                )}
              </div>
            </div>
            <div className='col-span-3 flex flex-col gap-3 self-end @2xl:text-end'>
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
                <Button
                  component={Link}
                  // onClick={() => {
                  //   onSelect({
                  //     hotelInfo,
                  //     resultItem,
                  //   })
                  // }}
                  href={detailUrl}
                >
                  Oda Seç
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HotelSearchResultItem }
