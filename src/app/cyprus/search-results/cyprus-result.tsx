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
  Tooltip,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'
import { FaBus, FaPlaneDeparture, FaRegCheckCircle } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import { IoChevronForward, IoStarSharp } from 'react-icons/io5'
import { FaFaceSmile } from 'react-icons/fa6'
import { Route } from 'next'
import dayjs from 'dayjs'

import { CyprusSearchResultsApiResponse } from '@/modules/cyprus/types'
import { formatCurrency } from '@/libs/util'
import { cyprusHotelDetailSerializer } from '../searchParams'

type IProps = {
  hotelInfo: CyprusSearchResultsApiResponse['hotelInfos'][0] | undefined
  resultItem: CyprusSearchResultsApiResponse['items'][0]
  roomDetail: CyprusSearchResultsApiResponse['roomDetails'][string] | undefined
  searchToken: string
  sessionToken: string
  searchParams: {
    checkInDate: Date
    checkOutDate: Date
    isTransfer: boolean
    isFlight: boolean
  }
}
const CyprusSearchResult: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  roomDetail,
  searchToken,
  sessionToken,
  searchParams,
}) => {
  const [isImageLoading, setImageLoading] = useState(true)

  const hotelImageUrl =
    hotelInfo?.images.at(0)?.large ?? hotelInfo?.images.at(0)?.original

  const nightCount = dayjs(resultItem.checkOutDate).diff(
    resultItem.checkInDate,
    'day'
  )

  const freeChildAges =
    resultItem.rooms.find((item) => item.freeChildAges)?.freeChildAges || null

  const totalPrice = resultItem?.totalPrice.value
  const discountValue = resultItem.discount.value
  const totalPriceWithDiscount = totalPrice + discountValue
  const hasDiscount = discountValue > 0 && totalPrice >= discountValue
  const discountRate = Math.round(
    ((totalPriceWithDiscount - totalPrice) / totalPriceWithDiscount) * 100
  )

  const detailUrl = cyprusHotelDetailSerializer(`/cyprus/${hotelInfo?.slug}`, {
    searchToken,
    sessionToken,
    productKey: resultItem.key,
    checkInDate: searchParams.checkInDate,
    checkOutDate: searchParams.checkOutDate,
    isTransfer: searchParams.isTransfer,
    isFlight: searchParams.isFlight,
  }) as Route
  // console.log('hotelInfo',  hotelInfo)

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
                <Link href={detailUrl}>
                  <Image
                    loading='lazy'
                    fallbackSrc='/default-room.jpg'
                    onLoad={(e) => {
                      setImageLoading(false)
                    }}
                    h={'100%'}
                    w={'100%'}
                    src={hotelImageUrl}
                    alt={hotelInfo?.name}
                    radius={'md'}
                    className='relative'
                  />
                </Link>
                {hotelInfo?.comment_info &&
                  hotelInfo.comment_info?.totalComments > 0 && (
                    <div className='absolute end-0 top-0 m-2 flex items-center gap-2 rounded bg-green-800 px-1 py-1 text-sm text-white md:hidden'>
                      <div>
                        <FaFaceSmile />
                      </div>
                      <div>{hotelInfo.comment_info.averageScore}</div>
                      <div className='text-white'>
                        {hotelInfo.comment_info.totalComments} Yorum
                      </div>
                    </div>
                  )}
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
              <div className='flex items-center gap-2 text-sm'>
                {hotelInfo?.stars ? (
                  <Rating
                    value={hotelInfo?.stars}
                    count={hotelInfo?.stars}
                    readOnly
                    fullSymbol={<IoStarSharp />}
                  />
                ) : null}
                <div className='flex items-center gap-1 text-xs'>
                  <span className='text-dark-700'>
                    {hotelInfo?.destination}
                  </span>
                </div>
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
                  <div className='flex items-center gap-1 text-blue-800'>
                    {searchParams.isFlight && (
                      <List.Item icon={<FaPlaneDeparture />}>Uçak</List.Item>
                    )}
                    {searchParams.isFlight && <span>+</span>}
                    {searchParams.isTransfer && (
                      <List.Item icon={<FaBus />}>Transfer</List.Item>
                    )}
                  </div>
                </List>
              </div>
              {freeChildAges && Array.isArray(freeChildAges) && (
                <div>
                  <Tooltip
                    label={freeChildAges.map((child, childIndex) => (
                      <div key={childIndex}>
                        <div>{child.whichChild}. Çocuk</div>
                        <div>
                          {child.ageFrom} - {Math.round(child.ageTo)} Yaş
                          ücretsiz
                        </div>
                      </div>
                    ))}
                  >
                    <Badge
                      component={UnstyledButton}
                      variant='outline'
                      radius={'sm'}
                      size='lg'
                      className='cursor-pointer'
                      classNames={{
                        root: 'border-gray-300 shadow-xs',
                        label: 'text-dark-700 font-normal',
                      }}
                    >
                      2 Çocuk Ücretsiz
                    </Badge>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex md:col-span-3 md:border-s'>
          <div className='flex flex-1 flex-col gap-3 py-2 md:px-6 md:py-5 md:ps-8'>
            {hotelInfo?.comment_info && (
              <div className='hidden items-center gap-3 self-end text-blue-800 md:flex'>
                <div className='text-lg font-semibold'>Çok İyi</div>
                <div className='rounded-t-lg rounded-br-lg bg-blue-100 p-2 text-xl leading-none font-bold'>
                  {hotelInfo.comment_info?.averageScore}
                </div>
              </div>
            )}
            <div className='mt-auto flex items-center px-5 text-start md:grid md:px-0 md:text-end'>
              <div className='grid'>
                <div className='flex items-center gap-2 text-blue-800'>
                  <List
                    size='xs'
                    className='mb-1 flex items-center gap-0.5 text-blue-800 md:ms-auto'
                  >
                    <List.Item>Otel</List.Item>
                    {searchParams.isFlight && <span>+</span>}
                    {searchParams.isFlight && <List.Item>Uçak</List.Item>}
                    {searchParams.isTransfer && <span>+</span>}
                    {searchParams.isTransfer && <List.Item>Transfer</List.Item>}
                  </List>
                </div>
                <div>
                  {hasDiscount ? (
                    <div>
                      <div className='inline-block items-center rounded-full bg-orange-800 p-2 text-sm leading-none font-semibold text-white'>
                        %{discountRate} İndirim
                      </div>

                      <div className='text-dark-200 text-sm'>
                        {nightCount} gece fiyatı
                      </div>
                      <div className='text-sm line-through'>
                        {formatCurrency(totalPriceWithDiscount)}
                      </div>
                    </div>
                  ) : (
                    <div className='text-dark-200 text-sm'>
                      {nightCount} gece fiyatı
                    </div>
                  )}
                  <div className='pb-1 text-2xl font-bold'>
                    {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>
              <div className='align-items-self-end ms-auto grid justify-self-end md:w-full'>
                <Button
                  component={Link}
                  href={detailUrl as Route}
                  fullWidth
                  rightSection={<IoChevronForward size={16} />}
                  size='md'
                  radius={'md'}
                >
                  Paketi Seç
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { CyprusSearchResult }
