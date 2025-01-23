import { useState } from 'react'

import { Button, Checkbox, Divider, Image, Title } from '@mantine/core'
import type {
  HotelDetailRoomDetail,
  HotelDetailRoomItem,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'

type IProps = {
  roomGroup: HotelDetailRoomItem
  roomDetails: { [key: string]: HotelDetailRoomDetail }
  onSelect: (roomGroup: HotelDetailRoomItem) => void
  onInstallmentClick?: (roomGroup: HotelDetailRoomItem) => void
}

const HotelRoom: React.FC<IProps> = ({
  roomGroup,
  roomDetails,
  onSelect = () => null,
  onInstallmentClick = () => null,
}) => {
  const [isCancelWarrantyChecked, setWarrantyCheck] = useState(
    roomGroup.useCancelWarranty
  )
  const rooms = roomGroup.rooms
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

  if (details && !details?.length) return null

  return (
    <div className='@container'>
      <div className='rounded-lg border'>
        {rooms.map((room, roomIndex, roomsArray) => {
          const detail = details?.find((x) => x.roomKey === room.key)
          const largeImages = detail?.images.map((x) => x.url.trim())
          const images = detail?.images.map((image) =>
            image.thumbnailUrl.trim()
          )
          const isLastItem = roomsArray.length - 1 === roomIndex

          if (!detail) return null

          return (
            <div
              className='grid gap-2 p-3 @lg:gap-3 @2xl:grid-cols-12'
              key={room.key}
            >
              <div className='@2xl:col-span-3 @2xl:row-span-2'>
                <Image
                  loading='lazy'
                  fallbackSrc='https://fulltrip.com/Content/images/default-room.jpg'
                  src={images?.at(0)}
                  alt={detail.roomType}
                  className='h-full max-h-52 rounded'
                />
              </div>
              <div className='@2xl:col-span-7'>
                <Title order={5}>{detail.roomType}</Title>
                <div
                  className='text-sm'
                  dangerouslySetInnerHTML={{
                    __html: detail.description,
                  }}
                />
              </div>
              {isLastItem && (
                <div className='self-end @2xl:col-span-2 @2xl:row-span-2 @2xl:justify-self-end'>
                  <div>
                    <div>
                      {discountRate > 0 && (
                        <div>
                          <div className='rounded bg-green-100 p-2 text-center leading-none'>
                            %{discountRate} indirim
                          </div>
                          <div className='pt-3 text-end text-sm line-through'>
                            {formatCurrency(discountPrice)}
                          </div>
                        </div>
                      )}
                      <div className='text-end text-lg font-semibold'>
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
                              roomGroup.useCancelWarranty =
                                currentTarget.checked
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className='pt-3'>
                      <Button
                        type='button'
                        fullWidth
                        onClick={() => onSelect(roomGroup)}
                      >
                        Odayı Seç
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        <Divider />
        <div className='p-2 text-end text-sm'>
          <Button
            type='button'
            size='xs'
            variant='white'
            onClick={() => onInstallmentClick(roomGroup)}
          >
            Kartlara Göre Fiyat Tablosu
          </Button>
        </div>
      </div>
    </div>
  )
}

export { HotelRoom }
