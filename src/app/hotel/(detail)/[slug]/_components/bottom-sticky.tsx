import { HotelDetailRoomItem } from '@/app/hotel/types'
import { PriceNumberFlow } from '@/components/price-numberflow'
import { formatCurrency } from '@/libs/util'
import { Button, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { HiPercentBadge } from 'react-icons/hi2'
import { IoChevronForwardSharp } from 'react-icons/io5'
import { diff } from 'util'

type IProps = {
  roomGroup: HotelDetailRoomItem
}
const BottomSticky: React.FC<IProps> = ({ roomGroup }) => {
  const totalPrice = roomGroup.totalPrice.value
  const discountPrice = roomGroup.discount.value + totalPrice
  const ScrollRooms = () => {
    const roomsSection = document.getElementById('rooms')
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  const discountRate =
    roomGroup.discount.value > 0
      ? Math.round(
          100 - (totalPrice / (roomGroup.discount.value + totalPrice)) * 100
        )
      : 0
  const nightCount = dayjs(roomGroup.checkOutDate).diff(
    roomGroup.checkInDate,
    'day'
  )

  return (
    <>
      {/* <input value={JSON.stringify(roomGroup, null, 2)} readOnly /> */}
      <div className='fixed right-0 bottom-0 left-0 z-50 md:hidden'>
        <div className='grid grid-cols-17 items-center gap-2 rounded-t-lg bg-white px-1 py-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
          {nightCount > 0 && (
            <Title
              order={3}
              className='text-muted-200 col-span-3 text-center text-sm'
            >
              {nightCount} Gece
            </Title>
          )}
          <Title
            order={3}
            className='col-span-7 items-center justify-center text-center'
          >
            {discountRate > 0 && (
              <>
                <div className='flex items-center justify-center gap-1 rounded text-xs font-semibold text-orange-700'>
                  <HiPercentBadge size={18} />
                  {discountRate} indirim
                </div>
                <div className='text-md pt-1 text-center line-through'>
                  {formatCurrency(discountPrice)}
                </div>
              </>
            )}
            <PriceNumberFlow value={roomGroup.totalPrice.value} />
          </Title>
          <Button
            onClick={ScrollRooms}
            variant='default'
            className='bg-primary col-span-7 border-none text-end text-white'
            radius={'md'}
            rightSection={<IoChevronForwardSharp size={20} />}
          >
            Odaları Gör
          </Button>{' '}
        </div>
      </div>
    </>
  )
}

export { BottomSticky }
