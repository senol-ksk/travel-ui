import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Image,
  List,
  Popover,
  Rating,
  Skeleton,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'
import { FaRegCheckCircle } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import { IoChevronForward, IoStarSharp } from 'react-icons/io5'

import {
  HotelCampaignsResponse,
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
  RoomDetailType,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import {
  hotelDetailSearchParams,
  hotelSearchParamParser,
} from '@/modules/hotel/searchParams'
import dayjs from 'dayjs'
import { MdOutlineStarRate } from 'react-icons/md'
import { Carousel } from '@mantine/carousel'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo | undefined
  resultItem: HotelSearchResultItemType
  roomDetail: RoomDetailType | undefined
  searchToken: string
  sessionToken: string
  campaignContents?: HotelCampaignsResponse[] | null
  onMapClick: () => void
}
const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const NightCountText: React.FC<{ count: number }> = ({ count }) => (
  <div className='text-dark-200 text-sm'>{count} gece fiyatı</div>
)

const HotelSearchResultItem: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  roomDetail,
  searchToken,
  sessionToken,
  onMapClick,
  campaignContents,
}) => {
  const [isImageLoading, setImageLoading] = useState(true)

  const hotelImageUrl =
    hotelInfo?.images.at(0)?.mid ?? hotelInfo?.images.at(0)?.large

  const nightCount = dayjs(resultItem.checkOutDate).diff(
    resultItem.checkInDate,
    'day'
  )

  const freeChildAges = resultItem.rooms.find(
    (item) => item.freeChildAges
  )?.freeChildAges

  const totalPrice = resultItem?.totalPrice.value
  const discountValue = resultItem.discount.value
  const totalPriceWithDiscount = totalPrice + discountValue
  const hasDiscount = discountValue > 0 && totalPrice >= discountValue
  const discountRate = Math.round(
    ((totalPriceWithDiscount - totalPrice) / totalPriceWithDiscount) * 100
  )

  const [searchParams] = useQueryStates(hotelSearchParamParser)

  const detailUrl = detailUrlSerializer(`/hotel/${hotelInfo?.slug}`, {
    slug: hotelInfo?.slug,
    productKey: resultItem.key,
    searchToken,
    sessionToken,
    propertyName: hotelInfo?.name,
    hotelSlug: hotelInfo?.slug,
    type: searchParams.type,
    checkInDate: searchParams.checkinDate,
    checkOutDate: searchParams.checkoutDate,
  })

  return (
    <div className='rounded-lg border border-gray-300 shadow'>
      <div className='grid md:grid-cols-12'>
        <div className='md:col-span-9'>
          <div className='grid gap-3 p-3 md:grid-cols-8'>
            <div className='md:col-span-3'>
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
            <div className='flex flex-col gap-2 pt-2 md:col-span-5'>
              <Title
                className='pb-1 @lg:text-lg'
                order={2}
                fz={'xl'}
                key={resultItem.hotelId}
              >
                {hotelInfo?.name}
              </Title>
              {hotelInfo?.comment_info && (
                <div className='flex items-center gap-1 text-end text-xs leading-none'>
                  <div className='flex items-center gap-1'>
                    <div className='text-md'>
                      <MdOutlineStarRate />
                    </div>
                    <div>{hotelInfo?.comment_info?.averageScore} puan</div>
                  </div>
                  <span>({hotelInfo?.comment_info?.totalComments} Yorum)</span>
                </div>
              )}
              {hotelInfo?.stars ? (
                <Rating
                  color='dark'
                  value={hotelInfo?.stars}
                  count={hotelInfo?.stars}
                  readOnly
                  fullSymbol={<IoStarSharp />}
                />
              ) : null}
              <div className='flex items-center gap-3 text-xs'>
                <span className='text-dark-700'>{hotelInfo?.destination}</span>

                {onMapClick && (
                  <UnstyledButton
                    fz='inherit'
                    className='text-blue-800 transition-colors hover:text-blue-900'
                    onClick={onMapClick}
                  >
                    Haritada Gör
                  </UnstyledButton>
                )}
              </div>
              <div>
                <List size='sm' className='text-teal-800'>
                  {roomDetail?.pensionType && (
                    <List.Item icon={<GiKnifeFork />}>
                      {roomDetail.pensionType}
                    </List.Item>
                  )}
                  {!resultItem.nonRefundable && (
                    <List.Item icon={<FaRegCheckCircle />}>
                      Ücretsiz İptal
                    </List.Item>
                  )}
                </List>
              </div>
              {freeChildAges && freeChildAges[0] && (
                <div>
                  <Popover
                    width={200}
                    position='bottom'
                    withArrow
                    arrowOffset={1}
                    shadow='lg'
                  >
                    <Popover.Target>
                      <Badge
                        component={UnstyledButton}
                        variant='outline'
                        radius={'sm'}
                        size='lg'
                        className='cursor-pointer'
                        classNames={{
                          root: 'border-gray-300',
                          label: 'text-dark-700 font-normal',
                        }}
                      >
                        2 Çocuk Ücretsiz
                      </Badge>
                    </Popover.Target>
                    <Popover.Dropdown className='gap-2'>
                      {freeChildAges.map((child, childIndex) => (
                        <div key={childIndex}>
                          <div>{child.whichChild}. Çocuk</div>
                          <div>
                            {child.ageFrom} - {Math.round(child.ageTo)} Yaş
                            ücretsiz
                          </div>
                        </div>
                      ))}
                    </Popover.Dropdown>
                  </Popover>
                </div>
              )}
            </div>
          </div>
          {campaignContents && campaignContents[0] ? (
            <div className='hidden border-t md:block'>
              <div className='p-3 text-sm'>
                <Carousel
                  slideSize={'auto'}
                  withControls={false}
                  emblaOptions={{ dragFree: true, align: 'start' }}
                  slideGap={'md'}
                >
                  {campaignContents?.map((campaign) => (
                    <Carousel.Slide key={campaign.id}>
                      <div className='rounded-md border-l-4 border-l-blue-800 bg-blue-100 px-3 py-2'>
                        {campaign.title}
                      </div>
                      {/* <Box
                        component='a'
                        href={campaign.params.link.value}
                        target='_blank'
                        className='block rounded-md border-l-4 border-l-blue-800 bg-blue-100 px-3 py-2'
                      >
                        {campaign.title}
                      </Box> */}
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </div>
            </div>
          ) : null}
        </div>
        <div className='flex md:col-span-3 md:border-s'>
          <div className='flex flex-1 flex-col gap-3 py-3 md:px-6 md:py-5 md:ps-8'>
            {hotelInfo?.comment_info && (
              <div className='hidden items-center gap-3 self-end text-blue-800 md:flex'>
                <div className='text-lg font-semibold'>Çok İyi</div>
                <div className='rounded-t-lg rounded-br-lg bg-blue-100 p-2 text-xl leading-none font-bold'>
                  {hotelInfo?.comment_info?.averageScore}
                </div>
              </div>
            )}
            <div className='mt-auto text-end'>
              <div>
                {hasDiscount ? (
                  <div>
                    <div className='inline-block items-center rounded bg-orange-800 p-2 text-sm leading-none font-semibold text-white'>
                      %{discountRate} İndirim
                    </div>

                    <NightCountText count={nightCount} />
                    <div className='text-sm line-through'>
                      {formatCurrency(totalPriceWithDiscount)}
                    </div>
                  </div>
                ) : (
                  <NightCountText count={nightCount} />
                )}
                <div className='pb-3 text-2xl font-bold'>
                  {formatCurrency(totalPrice)}
                </div>
              </div>

              <div>
                <Button
                  component={Link}
                  href={detailUrl}
                  fullWidth
                  rightSection={<IoChevronForward size={16} />}
                  size='md'
                >
                  Seç
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
