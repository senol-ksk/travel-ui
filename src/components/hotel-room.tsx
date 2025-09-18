import { useState } from 'react'

import {
  Button,
  Image,
  Title,
  Drawer,
  AspectRatio,
  Tooltip,
} from '@mantine/core'

import type {
  HotelDetailResponseHotelInfo,
  HotelDetailRoomDetail,
  HotelDetailRoomItem,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'
import dayjs from 'dayjs'
import { RiUserLine } from 'react-icons/ri'
import { PiAngle, PiCoffee } from 'react-icons/pi'
import { FaCheck } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { HiPercentBadge } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'

type IProps = {
  roomGroup: HotelDetailRoomItem
  roomDetails: { [key: string]: HotelDetailRoomDetail }
  onSelect: (roomGroup: HotelDetailRoomItem) => void
  onInstallmentClick?: (roomGroup: HotelDetailRoomItem) => void
  hotelInfo: HotelDetailResponseHotelInfo | undefined
}

const HotelRoom: React.FC<IProps> = ({
  roomGroup,
  roomDetails,
  onSelect = () => null,
  onInstallmentClick = () => null,
  hotelInfo,
}) => {
  const rooms = roomGroup.rooms
  const diffPriceGaranty = hotelInfo?.themes.find((item) => item.id === 385)
  const roomKeys = rooms?.map((x) => x.key) || [roomGroup.key]
  const totalPrice = roomGroup.totalPrice.value
  const discountRate =
    roomGroup.discount.value > 0
      ? Math.round(
          100 - (totalPrice / (roomGroup.discount.value + totalPrice)) * 100
        )
      : 0
  const discountPrice = roomGroup.discount.value + totalPrice
  const details = roomDetails
    ? Object.values(roomDetails).filter((roomDetail) =>
        roomKeys.includes(roomDetail.roomKey)
      )
    : null

  const [drawerOpened, setDrawerOpened] = useState(false)

  if (details && !details?.length) return null

  const timeDiff = dayjs(roomGroup.checkOutDate).diff(
    dayjs(roomGroup.checkInDate),
    'day'
  )

  return (
    <div className='rounded-lg border shadow-sm'>
      {rooms?.map((room, roomIndex, roomsArray) => {
        const detail = details?.find((x) => x.roomKey === room.key)
        const images = detail?.images.map((image) => {
          return image.url ? image.url?.trim() : image.thumbnailUrl?.trim()
        })
        const isLastItem = roomsArray.length - 1 === roomIndex
        const themesPriceDiff =
          roomGroup.provider == 'JollyHotel' && diffPriceGaranty

        if (!detail) return null

        return (
          <div
            className='gap-7 p-3 md:grid md:grid-cols-14 md:gap-6'
            key={room.key}
          >
            <div className='relative md:col-span-5'>
              <AspectRatio ratio={16 / 11}>
                <Image
                  loading='lazy'
                  fallbackSrc='/default-room.jpg'
                  src={images?.at(0)}
                  alt={detail.roomType}
                  className='h-full w-full cursor-pointer rounded object-cover'
                  onClick={() => setDrawerOpened(true)}
                />
              </AspectRatio>

              <Button
                className='absolute right-0 bottom-0 m-2'
                radius='md'
                onClick={() => setDrawerOpened(true)}
              >
                Odayı İncele
              </Button>
            </div>
            <div className='md:col-span-6'>
              <Title order={5} className='text-xl'>
                {detail.roomType}
              </Title>

              <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title={
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => setDrawerOpened(false)}
                      className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
                    >
                      <IoClose color='white' />
                    </button>
                    <div className='text-lg font-bold'>{detail.roomType}</div>
                  </div>
                }
                position='right'
                size='xl'
                radius='sm'
                closeButtonProps={{
                  style: { display: 'none' },
                }}
                classNames={{
                  header: 'p-0',
                }}
              >
                {
                  <div>
                    <Image
                      loading='lazy'
                      fallbackSrc='/default-room.jpg'
                      src={images?.at(0)}
                      alt={detail.roomType}
                      className='mb-6 h-full max-h-52 rounded'
                    />

                    {detail.size > 0 && (
                      <div>
                        {' '}
                        <div className='mb-4 w-15 rounded bg-gray-300 p-2 text-center text-xs font-bold'>
                          {detail.size} m²{' '}
                        </div>
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{ __html: detail.description }}
                    />
                  </div>
                }
              </Drawer>
              <div className='my-3 grid gap-2'>
                {detail.size > 0 && (
                  <div>
                    {' '}
                    <div className='flex items-center'>
                      <RiUserLine size={16} className='mr-2' />
                      <div>Max {detail.quantity} Kişilik</div>
                    </div>
                  </div>
                )}
                <div className='flex items-center'>
                  <PiCoffee size={16} className='mr-2' />
                  {detail.pensionType}
                </div>
                {detail.size > 0 && (
                  <div className='flex items-center'>
                    <PiAngle size={16} className='mr-2' />
                    {detail.size} m²
                  </div>
                )}
              </div>
              {themesPriceDiff && (
                <div className='flex items-center gap-1'>
                  <div className='text-green flex items-center font-semibold'>
                    <FaCheck size={15} className='mr-2' />
                    <div>Fiyat Farkı İade Garantisi</div>
                  </div>
                </div>
              )}
              {!roomGroup.nonRefundable && (
                <div className='flex items-center gap-1'>
                  <span className='text-green flex items-center font-semibold'>
                    <FaCheck size={15} className='mr-2' /> Ücretsiz İptal:{' '}
                  </span>
                  {dayjs(
                    roomGroup.cancellationPolicies
                      .sort(
                        (a, b) =>
                          new Date(a.optionDate).getDate() -
                          new Date(b.optionDate).getDate()
                      )
                      .at(0)?.optionDate
                  ).format('DD.MM.YYYY')}{' '}
                  tarihine kadar
                  {roomGroup.cancellationPolicies?.length > 1 && (
                    <Tooltip
                      label={
                        !roomGroup.nonRefundable && (
                          <div className='flex max-w-xs flex-col gap-1 text-sm whitespace-normal'>
                            {roomGroup.cancellationPolicies
                              .sort((a, b) => {
                                return (
                                  new Date(a.optionDate).getDate() -
                                  new Date(b.optionDate).getDate()
                                )
                              })
                              .map((cancelPolicy, cancelPolicyIndex) => (
                                <div key={cancelPolicyIndex}>
                                  {cancelPolicy.description}
                                </div>
                              ))}
                          </div>
                        )
                      }
                    >
                      <span>
                        <IoMdInformationCircleOutline />
                      </span>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
            {isLastItem && (
              <div className='item-center justify-center self-end md:col-span-3 md:justify-self-end'>
                <div>
                  <div>
                    {discountRate > 0 && (
                      <div className='mt-5 grid items-center justify-center md:mt-0 md:justify-end'>
                        <div className='text-md flex w-30 items-center rounded bg-orange-700 p-1 text-center leading-none font-semibold text-white md:text-end'>
                          <HiPercentBadge size={18} />%{discountRate} indirim
                        </div>
                        <div className='text-md text-center text-gray-600 md:text-end'>
                          {timeDiff} gece fiyatı
                        </div>
                        <div className='text-md pt-1 text-center line-through md:text-end'>
                          {formatCurrency(discountPrice)}
                        </div>
                      </div>
                    )}
                    <div className='text-center text-2xl font-bold md:text-end'>
                      <PriceNumberFlow value={roomGroup.totalPrice.value} />
                    </div>
                  </div>
                </div>
                <div>
                  <Button
                    className='p-2'
                    size='lg'
                    type='button'
                    fullWidth
                    radius={'md'}
                    onClick={() => onSelect(roomGroup)}
                  >
                    Rezervasyon Yap
                  </Button>
                  <div>
                    <Button
                      className='font-medium'
                      fullWidth
                      type='button'
                      size='sm'
                      variant='white'
                      onClick={() => onInstallmentClick(roomGroup)}
                    >
                      Taksit Seçenekleri
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { HotelRoom }
