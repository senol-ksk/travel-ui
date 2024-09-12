import { useState } from 'react'

import {
  NativeSelect,
  Button,
  CloseButton,
  Paper,
  Transition,
  Portal,
  Group,
  Radio,
} from '@mantine/core'

import { useMediaQuery, useClickOutside, useSetState } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

import dayjs from 'dayjs'
import clsx from 'clsx'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  tripKind?: 'one-way' | 'round-trip' | string
}

const FlightCalendar: React.FC<Props> = () => {
  const [tripKindState, setTripKindState] = useState<string>('one-way')
  const [rangeValue, setRangeValue] = useState<DatesRangeValue>([null, null])
  const [singValue, setSingleValue] = useState<DateValue>(null)
  const [formatedValues, setFormatedValues] = useState<
    [string | null, string | null]
  >([null, null])

  const matches = useMediaQuery('(min-width: 48em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const handleDateSelections = (dates: DatesRangeValue | DateValue) => {
    const defaultFormat = 'DD MMM ddd'
    let departurDate
    let returnDate

    if (Array.isArray(dates)) {
      departurDate = dates[0]
      returnDate = dates[1]
      setRangeValue(dates)
    } else if (dayjs(dates).isValid()) {
      departurDate = dates
      setSingleValue(dates)
    } else {
      console.error('Date type has some errors')
    }

    setFormatedValues([
      departurDate ? dayjs(departurDate).format(defaultFormat) : null,
      returnDate ? dayjs(returnDate).format(defaultFormat) : null,
    ])
  }

  return (
    <Provider>
      <div className='relative'>
        <Input
          label='Tarihler'
          icon={'calendar'}
          onClick={() => setContainerTransitionState(true)}
          title={
            formatedValues.filter(Boolean).length > 1
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
              className='fixed bottom-0 end-0 start-0 top-0 z-50 sm:p-20 md:absolute md:-end-2 md:bottom-auto md:start-[-240px] md:-ms-1 md:-mt-1 md:w-[600px] md:p-0 2xl:start-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl'>
                <div className='p-4'>
                  <Radio.Group
                    name='tripKind'
                    defaultValue={tripKindState}
                    onChange={(value) => {
                      setTripKindState(value)
                    }}
                  >
                    <Group gap={'2rem'}>
                      <Radio value='one-way' label='Tek Yön' />
                      <Radio value='round-trip' label='Gidiş-Dönüş' />
                    </Group>
                  </Radio.Group>
                </div>
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
                    {tripKindState === 'round-trip' && (
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
                            {formatedValues[1] ? (
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
                    {tripKindState === 'one-way' ? (
                      <DatePicker
                        value={singValue}
                        onChange={handleDateSelections}
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
                      />
                    ) : (
                      <DatePicker
                        value={rangeValue}
                        onChange={handleDateSelections}
                        type={'range'}
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
                      />
                    )}
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
          <div className='fixed bottom-0 end-0 start-0 top-0 bg-black bg-opacity-50 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { FlightCalendar }
