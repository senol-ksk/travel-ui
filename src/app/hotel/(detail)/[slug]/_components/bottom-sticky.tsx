import { HotelDetailRoomItem } from '@/app/hotel/types'
import { PriceNumberFlow } from '@/components/price-numberflow'
import { formatCurrency } from '@/libs/util'
import { Button, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { HiPercentBadge } from 'react-icons/hi2'
import { IoChevronForwardSharp } from 'react-icons/io5'

type IProps = {
  roomGroup: HotelDetailRoomItem
}

const BottomSticky: React.FC<IProps> = ({ roomGroup }) => {
  const totalPrice = roomGroup.totalPrice.value
  const basePrice = roomGroup.basePrice.value
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
    <div className='fixed right-0 bottom-0 left-0 z-20 md:hidden'>
      <div className='flex items-center justify-between rounded-t-lg bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
        <div className='flex flex-col'>
          <div className='grid items-center'>
            <div className='text-sm text-gray-500 line-through'>
              {formatCurrency(discountPrice)}
            </div>
            <div className='text-lg font-semibold'>
              <PriceNumberFlow value={roomGroup.totalPrice.value} />
            </div>
          </div>
          <div className='flex items-center gap-1 text-xs text-gray-600'>
            {nightCount > 0 && <div>{nightCount} Gece</div>}
            {discountRate > 0 && (
              <div className='flex items-center gap-1 text-orange-700'>
                <HiPercentBadge size={12} />
                {discountRate}% indirim
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={ScrollRooms}
          variant='default'
          className='bg-primary border-none text-white'
          radius={'md'}
          rightSection={<IoChevronForwardSharp size={20} />}
        >
          Odaları Gör
        </Button>
      </div>
    </div>
  )
}

export { BottomSticky }
