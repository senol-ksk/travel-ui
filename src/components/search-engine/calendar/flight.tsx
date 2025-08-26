import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import clsx from 'clsx'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import classes from '@/styles/Datepicker.module.css'
import { useOfficialDays } from './useOfficialDays'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  tripKind?: 'one-way' | 'round-trip'
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
}
const defaultFormat = 'DD MMM, ddd'

const FlightCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  tripKind = 'one-way',
  defaultDates,
}) => {
  const [rangeValue, setRangeValue] = useState<DatesRangeValue>([
    defaultDates?.at(0) || null,
    defaultDates?.at(1) || null,
  ])

  const [formattedDateValues, setFormattedValues] = useState<
    [string | null, string | null]
  >([
    dayjs(defaultDates?.at(0)).format(defaultFormat),
    dayjs(defaultDates?.at(1)).format(defaultFormat),
  ])

  const matches = useMediaQuery('(min-width: 62em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const { dayRenderer, handleOfficialDates, officialDayRenderer } =
    useOfficialDays({ numberOfColumns: 2 })

  const handleDateSelections = (dates: DatesRangeValue | DateValue) => {
    let departureDate
    let returnDate

    if (Array.isArray(dates)) {
      departureDate = dates.at(0)
      returnDate = dates.at(1)
      onDateSelect(dates)
      setFormattedValues([
        dayjs(departureDate).format(defaultFormat),
        dayjs(returnDate).format(defaultFormat),
      ])
    } else if (dayjs(dates).isValid()) {
      departureDate = dates
      onDateSelect([dates, dates])
      setFormattedValues([
        dayjs(departureDate).format(defaultFormat),
        dayjs(departureDate).format(defaultFormat),
      ])
    }
  }

  const numberOfColumns = matches ? 2 : 13

  return (
    <Provider>
      <div className='relative h-full'>
        <Input
          label={
            tripKind === 'round-trip' ? (
              <div className='flex w-full gap-[76px] md:px-2'>
                <span>Gidiş</span>
                <span>Dönüş</span>
              </div>
            ) : (
              <div className='md:px-2'>Gidiş</div>
            )
          }
          onClick={() => setContainerTransitionState(true)}
          title={
            tripKind === 'round-trip' ? (
              <div className='flex w-full items-center justify-between gap-2 md:px-2'>
                <span>{formattedDateValues[0] ?? 'Gidiş'}</span>
                <span>-</span>
                <span>{formattedDateValues[1] ?? 'Dönüş'}</span>
              </div>
            ) : (
              <span className='md:px-2'>
                {formattedDateValues[0] ?? 'Gidiş'}
              </span>
            )
          }
        />
        <Transition
          mounted={containerTransitionState}
          transition={matches ? 'pop-top-left' : 'pop'}
          onExit={() => {
            handleDateSelections([
              rangeValue[0],
              rangeValue[1]
                ? rangeValue[1]
                : dayjs(rangeValue[0]).add(2, 'd').toDate(),
            ])
          }}
        >
          {(styles) => (
            <div
              className='fixed start-0 end-0 top-0 bottom-0 z-50 mx-auto rounded-lg border md:absolute md:start-[-75px] md:end-auto md:bottom-auto'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl'>
                <div className='px-3 pt-3'>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-8 md:justify-start'>
                    <div className='flex'>
                      <div
                        className={clsx(
                          'border-b-4 px-2 text-start text-lg font-bold',
                          rangeValue[0] ? 'border-blue-800' : 'border-gray-300'
                        )}
                      >
                        {formattedDateValues[0] ? (
                          formattedDateValues[0]
                        ) : (
                          <span className='text-gray-400'>Gidiş</span>
                        )}
                      </div>
                    </div>
                    {tripKind === 'round-trip' && (
                      <>
                        <div className='text-xl'>
                          <IoArrowForwardSharp />
                        </div>
                        <div className='flex'>
                          <button
                            type='button'
                            className={clsx(
                              'border-b-4 px-2 text-start text-lg font-bold',
                              rangeValue[1]
                                ? 'border-blue-800'
                                : 'border-gray-300'
                            )}
                          >
                            {rangeValue[1] ? (
                              formattedDateValues[1]
                            ) : (
                              <span className='text-gray-400'>Dönüş</span>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth p-3'>
                  <DatePicker
                    highlightToday
                    onChange={(dates) => {
                      if (Array.isArray(dates)) {
                        setRangeValue(dates)

                        setFormattedValues([
                          dayjs(dates[0]).format(defaultFormat),
                          dayjs(dates[1]).format(defaultFormat),
                        ])
                      } else {
                        setRangeValue([dates, dates])
                        setFormattedValues([
                          dayjs(dates).format(defaultFormat),
                          dayjs(dates).format(defaultFormat),
                        ])
                      }
                    }}
                    type={tripKind === 'one-way' ? 'default' : 'range'}
                    allowSingleDateInRange
                    numberOfColumns={numberOfColumns}
                    minDate={today.toDate()}
                    maxDate={maxDate.toDate()}
                    maxLevel='month'
                    classNames={classes}
                    value={
                      tripKind === 'one-way' ? rangeValue?.at(0) : rangeValue
                    }
                    renderDay={dayRenderer}
                    onDateChange={handleOfficialDates}
                    onNextMonth={handleOfficialDates}
                    onPreviousMonth={handleOfficialDates}
                  />
                </div>
                <div className='flex items-center border-t p-3 md:justify-between'>
                  <div className='hidden flex-col gap-1 md:flex'>
                    {officialDayRenderer()}
                  </div>
                  <Button
                    type='button'
                    radius='xl'
                    className='w-full md:w-auto'
                    size='sm'
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
          <div className='fixed start-0 end-0 top-0 bottom-0 bg-black/50 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { FlightCalendar }
