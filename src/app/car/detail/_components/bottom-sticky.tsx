import { formatCurrency } from '@/libs/util'
import { Button, Title, Divider } from '@mantine/core'
import {
  IoChevronForwardSharp,
  IoChevronUpSharp,
  IoChevronDownSharp,
} from 'react-icons/io5'
import { DetailResponseData } from '../type'
import { useState } from 'react'

type IProps = {
  detailItem: DetailResponseData['detailResponse']['items'][0]
  selectedExtraOptionPrice: number
  selectedInsurancePrice: number
  onCarSelect: () => void
  isLoading: boolean
}

const CarBottomSticky: React.FC<IProps> = ({
  detailItem,
  selectedExtraOptionPrice,
  selectedInsurancePrice,
  onCarSelect,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const totalPrice = detailItem?.totalPrice.value ?? 0
  const allTotalPrice =
    selectedExtraOptionPrice + selectedInsurancePrice + totalPrice

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className='fixed right-0 bottom-0 left-0 z-50 md:hidden'>
      <div className='flex flex-col gap-2 rounded-t-lg bg-white px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
        <div
          className='flex cursor-pointer items-center justify-between'
          onClick={toggleExpanded}
        >
          <div className='text-sm font-medium'>Fiyat Özeti</div>
          <div className='flex items-center gap-2'>
            <div className='text-lg font-semibold'>
              {formatCurrency(allTotalPrice)}
            </div>
            {isExpanded ? (
              <IoChevronDownSharp size={16} />
            ) : (
              <IoChevronUpSharp size={16} />
            )}
          </div>
        </div>
        {isExpanded && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <div>Kartınızdan Çekilecek Tutar</div>
              <div>{formatCurrency(totalPrice)}</div>
            </div>
            {(selectedExtraOptionPrice || selectedInsurancePrice) > 0 && (
              <div className='flex items-center justify-between text-sm'>
                <div>Ofiste Ödenecek Tutar</div>
                <div>
                  {formatCurrency(
                    selectedExtraOptionPrice + selectedInsurancePrice
                  )}
                </div>
              </div>
            )}
            <Divider />
          </div>
        )}

        <Button
          onClick={onCarSelect}
          variant='default'
          size='md'
          className='bg-primary border-none text-white'
          radius={'md'}
          loading={isLoading}
          rightSection={<IoChevronForwardSharp size={20} />}
        >
          Ödemeye İlerle
        </Button>
      </div>
    </div>
  )
}

export { CarBottomSticky }
