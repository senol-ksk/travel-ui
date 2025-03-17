'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { DatePicker, type DateValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  onDateSelect?: (date: DateValue) => void
  defaultDate?: DateValue
}

const TransferCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDate,
}) => {
  const [rangeValue, setRangeValue] = useState<DateValue | undefined>(
    defaultDate
  )

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const handleDateSelections = (date: DateValue) => {
    setRangeValue(date)
    onDateSelect(date)
  }

  return (
    <Provider>
      <div className='relative'>
        <Input
          label='Tarihler'
          icon={'calendar'}
          onClick={() => setContainerTransitionState(true)}
          title={`${dayjs(rangeValue).format('DD MMMM')}`}
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-right'
        >
          {(styles) => (
            <div
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 sm:p-20 md:absolute md:bottom-auto md:-ms-1 md:-mt-1 md:w-[420px] md:p-0 2xl:start-0'
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
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth'>
                  <div>
                    <DatePicker
                      highlightToday
                      onChange={handleDateSelections}
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
                      defaultValue={rangeValue}
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
          <div className='z-modal fixed start-0 end-0 top-0 bottom-0 bg-black/90 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { TransferCalendar }
