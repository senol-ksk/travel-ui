import { Button, Image, TextInput, Title } from '@mantine/core'

import {
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
} from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo
  resultItem: HotelSearchResultItemType
  onSelect: ({
    hotelInfo,
    resultItem,
  }: {
    hotelInfo: HotelSearchResultHotelInfo
    resultItem: HotelSearchResultItemType
  }) => void
}

const HotelSearchResultItem: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  onSelect = () => null,
}) => {
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

  return (
    <div className='@container'>
      <div className='rounded-lg border border-gray-300'>
        {/* <TextInput value={JSON.stringify(hotelInfo)} readOnly />
        <TextInput value={JSON.stringify(resultItem)} readOnly /> */}
        <div className='p-3'>
          <div className='grid gap-3 @2xl:grid-cols-12'>
            <div className='col-span-9 grid gap-3 @2xl:grid-cols-3'>
              <div className='@2xl:col-span-1'>
                <Image
                  w={'100%'}
                  src={hotelImageUrl}
                  alt={hotelInfo.name}
                  radius={'md'}
                  mah={200} //max-height
                />
              </div>
              <div className='@2xl:col-span-2'>
                <Title
                  className='pb-4 text-md @lg:text-lg'
                  order={3}
                  key={resultItem.hotelId}
                >
                  {hotelInfo.name}
                </Title>
              </div>
            </div>
            <div className='col-span-3 flex flex-col gap-3 self-end @2xl:text-end'>
              <div>
                {hasDiscount && (
                  <>
                    <div className='inline-flex items-center justify-end gap-1 rounded-lg bg-blue-500 p-2 text-end text-sm font-semibold leading-none text-white'>
                      <div className=''>%{discountRate}</div>
                      <small>İndirim</small>
                    </div>
                    <div className='pb-2 pt-1 text-sm text-gray-500 line-through'>
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
                  onClick={() => {
                    onSelect({
                      hotelInfo,
                      resultItem,
                    })
                  }}
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
