import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  tripKind?: 'one-way' | 'round-trip'
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates?: DatesRangeValue
}
const defaultFormat = 'DD MMM ddd'

const FlightCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  tripKind = 'one-way',
  defaultDates,
}) => {
  const [rangeValue, setRangeValue] = useState<DatesRangeValue>([
    defaultDates?.at(0) || null,
    defaultDates?.at(1) || null,
  ])

  const [formatedValues, setFormatedValues] = useState<
    [string | null, string | null]
  >([null, null])

  const matches = useMediaQuery('(min-width: 48em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  useEffect(() => {
    if (defaultDates) {
      setRangeValue(defaultDates)
      setFormatedValues([
        dayjs(defaultDates.at(0)).format(defaultFormat),
        dayjs(defaultDates.at(1)).format(defaultFormat),
      ])
    }
  }, [defaultDates])

  const handleDateSelections = (dates: DatesRangeValue | DateValue) => {
    let departurDate
    let returnDate

    if (Array.isArray(dates)) {
      departurDate = dates.at(0)
      returnDate = dates.at(1)
      setRangeValue(dates)
      onDateSelect(dates)
      setFormatedValues([
        dayjs(departurDate).format(defaultFormat),
        dayjs(returnDate).format(defaultFormat),
      ])
    } else if (dayjs(dates).isValid()) {
      departurDate = dates
      setRangeValue([dates, null])
      onDateSelect([dates, dates])
      setFormatedValues([dayjs(departurDate).format(defaultFormat), null])
    } else {
      console.error('Date type has some errors')
    }
  }

  return (
    <Provider>
      <div className='relative'>
        <Input
          label='Tarihler'
          icon={'calendar'}
          onClick={() => setContainerTransitionState(true)}
          title={
            tripKind === 'round-trip'
              ? formatedValues.join(' - ')
              : formatedValues[0]
          }
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-right'
        >
          {(styles) => (
            <div
              className='fixed start-0 end-0 top-0 bottom-0 z-50 sm:p-20 md:absolute md:start-[-240px] md:-end-2 md:bottom-auto md:-ms-1 md:-mt-1 md:w-[600px] md:p-0 2xl:start-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl'>
                <div>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center gap-3 px-3 md:pt-3'>
                    <div className='flex-1'>
                      <button
                        type='button'
                        className={clsx(
                          'w-full border-b-4 px-2 text-start text-lg font-bold',
                          {
                            'border-cyan-500': !formatedValues[0],
                          }
                        )}
                      >
                        {formatedValues[0] ? (
                          formatedValues[0]
                        ) : (
                          <span className='text-gray-400'>Gidiş</span>
                        )}
                      </button>
                    </div>
                    {tripKind === 'round-trip' && (
                      <>
                        <div className='text-xl'>
                          <IoArrowForwardSharp />
                        </div>
                        <div className='flex-1'>
                          <button
                            type='button'
                            className={clsx(
                              'w-full border-b-4 px-2 text-start text-lg font-bold',
                              {
                                'border-cyan-500': !formatedValues[1],
                              }
                            )}
                          >
                            {rangeValue[1] ? (
                              formatedValues[1]
                            ) : (
                              <span className='text-gray-400'>Dönüş</span>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth'>
                  <div>
                    <DatePicker
                      highlightToday
                      onChange={handleDateSelections}
                      type={tripKind === 'one-way' ? 'default' : 'range'}
                      allowSingleDateInRange
                      numberOfColumns={matches ? 2 : 13}
                      minDate={today.toDate()}
                      maxDate={maxDate.toDate()}
                      maxLevel='month'
                      classNames={{
                        levelsGroup: 'flex-col p-2 md:flex-row',
                        month: 'w-full',
                        day: 'text-sm w-full',
                        monthCell: 'text-center',
                        calendarHeader: 'mx-auto max-w-full',
                        calendarHeaderLevel: 'text-base',
                        weekday: 'text-black',
                      }}
                      defaultValue={
                        tripKind === 'one-way' ? rangeValue?.at(0) : rangeValue
                      }
                    />
                  </div>
                </div>
                <div className='flex border-t p-2 md:justify-end md:p-3'>
                  <Button
                    type='button'
                    className='w-full md:w-auto'
                    size='lg'
                    onClick={() => setContainerTransitionState(false)}
                  >
                    Tamam
                  </Button>
                </div>
              </Paper>
            </div>
          )}
        </Transition>
      </div>

      {containerTransitionState && (
        <Portal>
          <div className='bg-opacity-50 fixed start-0 end-0 top-0 bottom-0 bg-black md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { FlightCalendar }
