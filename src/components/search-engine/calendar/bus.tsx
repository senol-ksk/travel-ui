'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useClickOutside, useMediaQuery } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'
import type { DateValue } from '@mantine/dates'
import classes from '@/styles/Datepicker.module.css'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import { RiCalendarEventLine } from 'react-icons/ri'
import { useOfficialDays } from './useOfficialDays'
import { clsx } from 'clsx'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  onDateSelect?: (date: DateValue) => void
  defaultDate: DateValue
}

const BusCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDate,
}) => {
  const [rangeValue, setRangeValue] = useState<DateValue>(defaultDate)

  useEffect(() => {
    setRangeValue(defaultDate)
  }, [defaultDate])

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const { dayRenderer, handleOfficialDates, officialDayRenderer } =
    useOfficialDays({ numberOfColumns: 1 })

  const handleDateSelections = (date: DateValue) => {
    setRangeValue(date)

    onDateSelect(date)
  }
  const matches = useMediaQuery('(min-width: 62em)')
  const numberOfColumns = matches ? 1 : 8

  return (
    <Provider>
      <div className='relative h-full'>
        <RiCalendarEventLine
          size={20}
          className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
        />{' '}
        <Input
          label='Gidiş Tarihi'
          onClick={() => setContainerTransitionState(true)}
          title={`${dayjs(rangeValue).format('DD MMMM')}`}
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-right'
        >
          {(styles) => (
            <div
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 rounded-lg sm:p-20 md:absolute md:bottom-auto md:-ms-1 md:-mt-1 md:w-[350px] md:p-0 2xl:start-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg border shadow-xl'>
                <div>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-8 px-3 pb-5 md:pt-3 md:pb-0'>
                    <div className='flex'>
                      <button
                        type='button'
                        className={clsx(
                          'border-b-4 px-2 text-start text-lg font-bold',
                          rangeValue ? 'border-blue-800' : 'border-gray-300'
                        )}
                      >
                        {rangeValue ? (
                          dayjs(rangeValue).format('DD MMM ddd')
                        ) : (
                          <span className='text-gray-400'>Gidiş Tarihi</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='relative mx-auto grow overflow-y-auto overscroll-contain scroll-smooth'>
                  <div className='py-3'>
                    <DatePicker
                      highlightToday
                      onChange={handleDateSelections}
                      minDate={today.toDate()}
                      maxDate={maxDate.toDate()}
                      maxLevel='month'
                      classNames={classes}
                      value={rangeValue}
                      renderDay={dayRenderer}
                      onDateChange={handleOfficialDates}
                      onNextMonth={handleOfficialDates}
                      onPreviousMonth={handleOfficialDates}
                      numberOfColumns={numberOfColumns}
                    />
                  </div>
                </div>
                <div className='flex border-t p-3 md:justify-between'>
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
          <div className='z-modal fixed start-0 end-0 top-0 bottom-0 bg-black/90 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { BusCalendar }
