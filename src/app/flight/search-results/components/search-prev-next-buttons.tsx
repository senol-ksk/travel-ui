'use client'
import React from 'react'
import { Button, Skeleton } from '@mantine/core'
import dayjs from 'dayjs'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { SearchResult } from '@/app/car/search-results/search-result'

type IProps = {
  activeTripKind: string
  searchResultsQuery: {
    isLoading: boolean
    isFetching: boolean
    isFetchingNextPage?: boolean
  }
  searchSessionTokenQuery: { isLoading: boolean }
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
  activeTripKind,
  searchSessionTokenQuery,
  searchResultsQuery,
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
      {!isDomestic && activeTripKind === '1' ? (
        <Skeleton
          className='sticky top-0 z-10 mt-3 flex items-center justify-between gap-1 text-center'
          visible={
            searchResultsQuery.isLoading ||
            searchResultsQuery.isFetching ||
            searchResultsQuery.isFetchingNextPage ||
            searchSessionTokenQuery.isLoading
          }
        >
          <Button
            size='md'
            variant='outline'
            className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft color='black' size={18} />
            <span className='hidden font-normal text-black md:block'>
              Önceki Gün
            </span>
          </Button>

          <div className='flex flex-grow justify-center rounded bg-gray-200 py-2 font-medium'>
            {(() => {
              const calendarDate =
                isReturnFlightVisible && returnDate ? returnDate : departureDate
              return calendarDate
                ? dayjs(calendarDate).format('D MMM YYYY, ddd')
                : ''
            })()}
          </div>

          <Button
            size='md'
            variant='outline'
            className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
            onClick={onNextDay}
          >
            <span className='hidden font-normal text-black md:block'>
              Sonraki Gün
            </span>
            <MdKeyboardArrowRight size={18} color='black' className='md:mt-1' />
          </Button>
        </Skeleton>
      ) : (
        isDomestic && (
          <Skeleton
            className='sticky top-0 z-10 mt-3 flex items-center justify-between gap-1 text-center'
            visible={
              searchResultsQuery.isLoading ||
              searchResultsQuery.isFetching ||
              searchResultsQuery.isFetchingNextPage ||
              searchSessionTokenQuery.isLoading
            }
          >
            <Button
              size='md'
              variant='outline'
              className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
              onClick={onPrevDay}
            >
              <MdKeyboardArrowLeft color='black' size={18} />
              <span className='hidden font-normal text-black md:block'>
                Önceki Gün
              </span>
            </Button>

            <div className='flex flex-grow justify-center rounded bg-gray-200 py-2 font-medium'>
              {(() => {
                const calendarDate =
                  isReturnFlightVisible && returnDate
                    ? returnDate
                    : departureDate
                return calendarDate
                  ? dayjs(calendarDate).format('D MMM YYYY, ddd')
                  : ''
              })()}
            </div>

            <Button
              size='md'
              variant='outline'
              className='flex items-center gap-2 border-transparent bg-gray-200 hover:border-blue-800'
              onClick={onNextDay}
            >
              <span className='hidden font-normal text-black md:block'>
                Sonraki Gün
              </span>
              <MdKeyboardArrowRight
                size={18}
                color='black'
                className='md:mt-1'
              />
            </Button>
          </Skeleton>
        )
      )}

      {!isDomestic && activeTripKind === '2' && (
        <Skeleton
          className='sticky top-0 z-10 mt-3 flex items-center justify-between gap-1 text-center'
          visible={
            searchResultsQuery.isLoading ||
            searchResultsQuery.isFetching ||
            searchResultsQuery.isFetchingNextPage ||
            searchSessionTokenQuery.isLoading
          }
        >
          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='flex items-center gap-2 border-transparent bg-gray-200 py-2 font-normal hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='flex items-center gap-2 border-transparent bg-gray-200 font-normal hover:border-blue-800'
            onClick={onNextDay}
          >
            <span className='hidden md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight size={18} />
          </Button>

          <div className='border-gray flex-grow rounded bg-gray-200 py-2 text-center text-sm font-medium'>
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
            className='flex items-center gap-2 border-transparent bg-gray-200 font-normal hover:border-blue-800'
            onClick={onPrevReturnDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='flex items-center gap-2 border-transparent bg-gray-200 font-normal hover:border-blue-800'
            onClick={onNextReturnDay}
          >
            <span className='hidden md:block'>Sonraki Gün</span>
            <MdKeyboardArrowRight size={18} />
          </Button>
        </Skeleton>
      )}
      {!isDomestic && !returnDate && (
        <div className='sticky top-0 z-10 flex items-center justify-between gap-1 py-2 text-center md:gap-2'>
          <Button
            color='gray'
            size='sm'
            variant='outline'
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-200 text-xs hover:border-blue-800'
            onClick={onPrevDay}
          >
            <MdKeyboardArrowLeft size={18} />
            <span className='hidden md:block'>Önceki Gün</span>
          </Button>

          <div className='border-gray md:text-md flex-grow rounded bg-gray-200 text-center text-sm font-medium'>
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
            className='md:text-md flex items-center gap-2 border-transparent bg-gray-200 text-xs hover:border-blue-800'
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
