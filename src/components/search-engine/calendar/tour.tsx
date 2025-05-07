import { useState } from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import { DatePicker } from '@mantine/dates'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
}
const defaultFormat = 'DD MMM ddd'

import { MdOutlineArrowForward } from 'react-icons/md'

const TourCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDates,
}) => {
  const [rangeValue, setRangeValue] = useState<DatesRangeValue>([
    defaultDates[0],
    defaultDates[1],
  ])

  const [formatedValues, setFormatedValues] = useState<
    [string | null, string | null]
  >([
    rangeValue[0] ? dayjs(rangeValue[0]).format(defaultFormat) : 'Giriş Tarihi',
    rangeValue[1] ? dayjs(rangeValue[1]).format(defaultFormat) : 'Çıkış Tarihi',
  ])

  const matches = useMediaQuery('(min-width: 48em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const handleDateSelections = (dates: DatesRangeValue) => {
    setRangeValue(dates)

    onDateSelect(dates)
    setFormatedValues([
      dates[0] ? dayjs(dates[0]).format(defaultFormat) : 'Giriş Tarihi',
      dates[1] ? dayjs(dates[1]).format(defaultFormat) : 'Çıkış Tarihi',
    ])
  }

  return (
    <Provider>
      <div className='relative'>
        <Input
          label='Tarihler'
          onClick={() => setContainerTransitionState(true)}
          title={`${dayjs(rangeValue[0]).format('DD MMM')} -
            ${dayjs(rangeValue[1]).format('DD MMM')}`}
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-right'
          onExit={() => {
            if (!rangeValue[1]) {
              handleDateSelections([
                rangeValue[0],
                dayjs(rangeValue[0]).add(1, 'd').toDate(),
              ])
            }
          }}
        >
          {(styles) => (
            <div
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 sm:p-20 md:absolute md:start-[-240px] md:-end-2 md:bottom-auto md:-ms-1 md:-mt-1 md:w-[600px] md:p-0 2xl:start-0'
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
                  <div className='inline-flex items-center gap-3 px-3 md:pt-3'>
                    <div
                      className={clsx(
                        'inline-flex border-b-4 px-2 text-start text-lg font-bold',
                        {
                          'border-cyan-500': !rangeValue[0],
                        }
                      )}
                    >
                      {formatedValues[0]}
                    </div>
                    <div>
                      <MdOutlineArrowForward size={20} />
                    </div>
                    <div
                      className={clsx(
                        'inline-flex border-b-4 px-2 text-start text-lg font-bold',
                        {
                          'border-cyan-500':
                            !(!rangeValue[0] && !rangeValue[1]) &&
                            !rangeValue[1],
                        }
                      )}
                    >
                      {formatedValues[1]}
                    </div>
                  </div>
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth'>
                  <div>
                    <DatePicker
                      highlightToday
                      onChange={handleDateSelections}
                      type={'range'}
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

export { TourCalendar }
