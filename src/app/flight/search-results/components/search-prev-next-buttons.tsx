'use client'
import React from 'react'
import { Button, Skeleton } from '@mantine/core'
import dayjs from 'dayjs'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'

type IProps = {
  onPrevDay: () => void
  onNextDay: () => void
  onPrevReturnDay?: () => void
  onNextReturnDay?: () => void
  departureDate: string | Date
  returnDate?: string | Date
  isDomestic?: boolean | null
  isReturnFlightVisible?: boolean
}

const SearchPrevNextButtons: React.FC<IProps> = ({
  onPrevDay,
  onNextDay,
  onPrevReturnDay,
  onNextReturnDay,
  departureDate,
  returnDate,
  isDomestic,
  isReturnFlightVisible,
}) => {
  return (
    <>
      {isDomestic && (
        <div className='sticky top-0 z-10 flex items-center justify-between gap-1 text-center'>
          <Button
            size='md'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft color='black' size={18} />
            <span className='hidden text-black md:block'>Önceki Gün</span>
          </Button>

          <div className='md:text-md flex flex-grow justify-center rounded bg-gray-100 py-2 text-sm font-medium'>
            {(() => {
              const calendarDate =
                isReturnFlightVisible && returnDate ? returnDate : departureDate
              return calendarDate
                ? dayjs(calendarDate).format('D MMM YYYY')
                : ''
            })()}
          </div>

          <Button
            size='md'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onNextDay}
          >
            <span className='hidden text-black md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight size={18} color='black' className='md:mt-1' />
          </Button>
        </div>
      )}

      {!isDomestic && returnDate && (
        <div className='sticky top-0 z-10 flex items-center justify-between gap-1 text-center'>
          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 py-2 text-xs hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onNextDay}
          >
            <span className='hidden md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight size={18} />
          </Button>

          <div className='border-gray md:text-md flex-grow rounded bg-gray-100 text-center text-xs font-medium'>
            {departureDate && returnDate ? (
              <>
                <div className='hidden justify-center md:flex'>
                  <div>{dayjs(departureDate).format('D MMM YYYY')}</div>
                  <div className='mx-2'>-</div>
                  <div>{dayjs(returnDate).format('D MMM YYYY')}</div>
                </div>
                <div className='flex justify-center md:hidden'>
                  <div>{dayjs(departureDate).format('D MMM')}</div>
                  <div className='mx-1'>-</div>
                  <div>{dayjs(returnDate).format('D MMM')}</div>
                </div>
                <div className='justify-center text-xs text-gray-600'>
                  Gidiş-Dönüş
                </div>
              </>
            ) : departureDate ? (
              <>
                <div>{dayjs(departureDate).format('D MMMM YYYY')}</div>
                <div className='text-xs text-gray-600'>Gidiş</div>
              </>
            ) : (
              ''
            )}
          </div>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onPrevReturnDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onNextReturnDay}
          >
            <span className='hidden md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight size={18} />
          </Button>
        </div>
      )}
      {!isDomestic && !returnDate && (
        <div className='sticky top-0 z-10 flex items-center justify-between gap-1 py-2 text-center md:gap-2'>
          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <div className='border-gray md:text-md flex-grow rounded bg-gray-100 text-center text-sm font-medium'>
            {departureDate && returnDate ? (
              <>
                <div className='hidden justify-center md:flex'>
                  <div>{dayjs(departureDate).format('DD MMM YYYY')}</div>
                  <div className='mx-2'>-</div>
                  <div>{dayjs(returnDate).format('DD MMM YYYY')}</div>
                </div>
                <div className='flex justify-center md:hidden'>
                  <div>{dayjs(departureDate).format('DD MMM')}</div>
                  <div className='mx-1'>-</div>
                  <div>{dayjs(returnDate).format('DD MMM')}</div>
                </div>
                <div className='text-xs text-gray-600'>Gidiş-Dönüş</div>
              </>
            ) : departureDate ? (
              <>
                <div>{dayjs(departureDate).format('D MMMM YYYY')}</div>
                <div className='text-xs text-gray-600'>Gidiş</div>
              </>
            ) : (
              ''
            )}
          </div>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-100 text-xs hover:border-blue-800'
            onClick={onNextDay}
          >
            <span className='hidden md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight className='md:mt-1' size={18} />
          </Button>
        </div>
      )}
    </>
  )
}

export { SearchPrevNextButtons }
