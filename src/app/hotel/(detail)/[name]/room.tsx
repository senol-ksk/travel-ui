import { useState } from 'react'

import {
  Button,
  Checkbox,
  Divider,
  Image,
  Title,
  Drawer,
  AspectRatio,
} from '@mantine/core'

import type {
  HotelDetailApiResponseData,
  HotelDetailResponseHotelInfo,
  HotelDetailRoomDetail,
  HotelDetailRoomItem,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'
import dayjs from 'dayjs'

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
  const [isCancelWarrantyChecked, setWarrantyCheck] = useState(
    roomGroup.useCancelWarranty
  )
  const rooms = roomGroup.rooms
  const diffPriceGaranty = hotelInfo?.themes.find((item) => item.id === 385)
  const roomKeys = rooms.map((x) => x.key)
  const cancelWarrantyPrice = roomGroup.cancelWarrantyPrice.value
  const hasCancelWarranty = cancelWarrantyPrice > 0
  const totalPrice = roomGroup.totalPrice.value
  const totalPriceWithCancelWarranty = totalPrice + cancelWarrantyPrice
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
  // const themesPriceDiff = roomGroup.provider == 'JollyHotel' && details?.find(item => item.)

  return (
    <div className='rounded-lg border shadow-sm'>
      {rooms.map((room, roomIndex, roomsArray) => {
        const detail = details?.find((x) => x.roomKey === room.key)
        const images = detail?.images.map((image) =>
          image.thumbnailUrl ? image.thumbnailUrl?.trim() : image.url?.trim()
        )
        const isLastItem = roomsArray.length - 1 === roomIndex
        const themesPriceDiff =
          roomGroup.provider == 'JollyHotel' && diffPriceGaranty

        if (!detail) return null

        return (
          <div
            className='grid gap-2 p-3 lg:gap-3 xl:grid-cols-12'
            key={room.key}
          >
            <div className='xl:col-span-3 2xl:row-span-2'>
              <AspectRatio>
                <Image
                  loading='lazy'
                  fallbackSrc='https://fulltrip.com/Content/images/default-room.jpg'
                  src={images?.at(0)}
                  alt={detail.roomType}
                  className='h-full cursor-pointer rounded'
                  onClick={() => setDrawerOpened(true)}
                />
              </AspectRatio>
            </div>
            <div className='2xl:col-span-7'>
              <Title order={5}>{detail.roomType}</Title>
              {!roomGroup.nonRefundable && (
                <div className='text-green text-sm'>
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
              )}
              <Drawer
                position='right'
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title={detail.roomType}
                size='md'
              >
                {
                  <div>
                    <Image
                      loading='lazy'
                      fallbackSrc='https://fulltrip.com/Content/images/default-room.jpg'
                      src={images?.at(0)}
                      alt={detail.roomType}
                      className='mb-6 h-full max-h-52 rounded pb-6'
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
              {detail.size > 0 && (
                <div>
                  {' '}
                  <div className='mt-4 rounded text-xs font-bold'>
                    {detail.size} m²{' '}
                  </div>
                </div>
              )}
              {detail.pensionType}
              <div>Max {detail.quantity} Kişilik</div>
              {themesPriceDiff && <div>Fiyat Farkı İade Garantisi</div>}
              {!roomGroup.nonRefundable && (
                <div>
                  <span className='text-green font-semibold'>
                    Ücretsiz İptal:{' '}
                  </span>
                  {dayjs(
                    roomGroup.cancellationPolicies
                      .sort(
                        (a, b) =>
                          new Date(a.optionDate).getDate() -
                          new Date(b.optionDate).getDate()
                      )
                      .at(0)?.optionDate
                  ).format('DD.MM.YYYY')}
                  tarihine kadar
                </div>
              )}
            </div>
            {isLastItem && (
              <div className='item-center grid justify-center self-end 2xl:col-span-2 2xl:row-span-2 2xl:justify-self-end'>
                <div>
                  <div>
                    {discountRate > 0 && (
                      <div className='grid items-center justify-center'>
                        <div className='flex w-30 items-center rounded bg-orange-700 p-2 text-center leading-none font-bold text-white'>
                          %{discountRate} indirim
                        </div>
                        <div className='pt-1 text-center text-sm line-through'>
                          {formatCurrency(discountPrice)}
                        </div>
                      </div>
                    )}
                    <div className='text-center text-xl font-bold'>
                      <PriceNumberFlow
                        value={
                          isCancelWarrantyChecked
                            ? totalPriceWithCancelWarranty
                            : roomGroup.totalPrice.value
                        }
                      />
                    </div>
                    {hasCancelWarranty && (
                      <div className='pt-4'>
                        <Checkbox
                          label={
                            <span>
                              <strong>
                                {formatCurrency(cancelWarrantyPrice)}
                              </strong>{' '}
                              İptal Güvence Paketi Ekle
                            </span>
                          }
                          defaultChecked={isCancelWarrantyChecked}
                          size='xs'
                          onChange={({ currentTarget }) => {
                            setWarrantyCheck(currentTarget.checked)
                            roomGroup.useCancelWarranty = currentTarget.checked
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className='grid'>
                    <Button
                      size='sm'
                      type='button'
                      fullWidth
                      onClick={() => onSelect(roomGroup)}
                    >
                      Rezervasyon Yap
                    </Button>
                    <div>
                      <Button
                        fullWidth
                        type='button'
                        size='xs'
                        variant='white'
                        onClick={() => onInstallmentClick(roomGroup)}
                      >
                        Taksit Seçenekleri
                      </Button>
                    </div>
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
