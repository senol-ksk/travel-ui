import { useState } from 'react'

import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'
import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

import dayjs from 'dayjs'
import clsx from 'clsx'

const today = dayjs()
const maxDate = today.add(1, 'year')

const FlightCalendar = () => {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null])
  const matches = useMediaQuery('(min-width: 48em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  return (
    <Provider>
      <div className='relative'>
        <Input
          label='Tarihler'
          icon={'calendar'}
          onClick={() => setContainerTransitionState(true)}
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
                <div>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton size='lg' />
                  </div>
                  <div className='flex items-center gap-3 px-3 md:pt-3'>
                    <div className='flex-1'>
                      <button
                        type='button'
                        className={clsx(
                          'w-full border-b-4 px-2 text-start text-lg font-bold',
                          {
                            'border-cyan-500': !value[0],
                          }
                        )}
                      >
                        {value[0] ? (
                          dayjs(value[0]).format('D MMM ddd')
                        ) : (
                          <span className='text-gray-400'>Gidiş</span>
                        )}
                      </button>
                    </div>
                    <div className='text-xl'>
                      <IoArrowForwardSharp />
                    </div>
                    <div className='flex-1'>
                      <button
                        type='button'
                        className={clsx(
                          'w-full border-b-4 px-2 text-start text-lg font-bold',
                          {
                            'border-cyan-500': !value[1],
                          }
                        )}
                      >
                        {value[1] ? (
                          dayjs(value[1]).format('D MMM ddd')
                        ) : (
                          <span className='text-gray-400'>Dönüş</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth'>
                  <div>
                    <DatePicker
                      value={value}
                      onChange={setValue}
                      type='range'
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
