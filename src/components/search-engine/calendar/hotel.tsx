import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { Button, CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import { DatePicker, type DatesRangeValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import classes from '@/styles/Datepicker.module.css'

const today = dayjs()
const maxDate = today.add(1, 'year')

type Props = {
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
  showCalendar?: boolean
}
const defaultFormat = 'DD MMM ddd'

import { MdOutlineArrowForward } from 'react-icons/md'
import { RiCalendarEventLine } from 'react-icons/ri'
import { useOfficialDays } from './useOfficialDays'

const HotelCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDates,
  showCalendar = false,
}) => {
  const [rangeValue, setRangeValue] = useState<DatesRangeValue>([
    defaultDates[0],
    defaultDates[1],
  ])
  const { dayRenderer, handleOfficialDates, officialDayRenderer } =
    useOfficialDays({ numberOfColumns: 2 })

  const [formattedValues, setFormattedValues] = useState<
    [string | null, string | null]
  >([
    rangeValue[0] ? dayjs(rangeValue[0]).format(defaultFormat) : 'Giriş Tarihi',
    rangeValue[1] ? dayjs(rangeValue[1]).format(defaultFormat) : 'Çıkış Tarihi',
  ])

  const matches = useMediaQuery('(min-width: 62em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const [numberOfNights, setNumberOfNights] = useState<number | null>(null)

  const clickOutsideRef = useClickOutside(() => {
    setContainerTransitionState(false)
  })

  const handleDateSelections = (dates: DatesRangeValue) => {
    const isDatesValid =
      dates.filter((date) => dayjs(date).isValid()).length > 1

    setFormattedValues([
      dates[0] ? dayjs(dates[0]).format(defaultFormat) : 'Giriş Tarihi',
      dates[1] ? dayjs(dates[1]).format(defaultFormat) : 'Çıkış Tarihi',
    ])

    if (isDatesValid) {
      setRangeValue(dates)

      onDateSelect(dates)
    }
  }

  useEffect(() => {
    if (rangeValue && rangeValue[0] && rangeValue[1]) {
      const startDate = dayjs(rangeValue[0])
      const endDate = dayjs(rangeValue[1])
      if (
        startDate.isValid() &&
        endDate.isValid() &&
        endDate.isAfter(startDate, 'day')
      ) {
        const nights = endDate.diff(startDate, 'day')
        setNumberOfNights(nights)
      } else {
        setNumberOfNights(null)
      }
    } else {
      setNumberOfNights(null)
    }
  }, [rangeValue])

  return (
    <Provider>
      <div className='relative h-full'>
        <RiCalendarEventLine
          size={20}
          className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
        />

        <Input
          label={
            <div className='flex w-full gap-[40px] md:px-2'>
              <span>Giriş Tarihi</span>
              <span>Çıkış Tarihi</span>
            </div>
          }
          onClick={() => setContainerTransitionState(true)}
          title={
            <div className='flex w-full items-center justify-between gap-[10px] md:px-2'>
              <span>{dayjs(rangeValue[0]).format('DD MMM, ddd')}</span>
              <span>-</span>
              <span>{dayjs(rangeValue[1]).format('DD MMM, ddd')}</span>
            </div>
          }
        />
        <Transition
          mounted={containerTransitionState}
          transition='pop-top-left'
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
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 rounded-lg border sm:p-20 md:absolute md:start-auto md:end-auto md:bottom-auto md:-ms-1 md:-mt-1 md:p-0 2xl:start-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl md:h-auto'>
                <div>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-3 px-3 md:justify-start md:pt-3'>
                    <div
                      className={clsx(
                        'inline-flex border-b-4 px-2 text-start text-lg font-bold',
                        rangeValue[0] && dayjs(rangeValue[0]).isValid()
                          ? 'border-blue-800'
                          : 'border-gray-300'
                      )}
                    >
                      {formattedValues[0]}
                    </div>
                    <div>
                      <MdOutlineArrowForward size={20} />
                    </div>
                    <div
                      className={clsx(
                        'inline-flex border-b-4 px-2 text-start text-lg font-bold',
                        rangeValue[1] && dayjs(rangeValue[1]).isValid()
                          ? 'border-blue-800'
                          : 'border-gray-300'
                      )}
                    >
                      {formattedValues[1]}
                    </div>
                  </div>
                </div>
                <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth p-3'>
                  <DatePicker
                    highlightToday
                    onChange={handleDateSelections}
                    type={'range'}
                    classNames={classes}
                    numberOfColumns={matches ? 2 : 12}
                    minDate={today.toDate()}
                    maxDate={maxDate.toDate()}
                    maxLevel='month'
                    defaultValue={rangeValue}
                    renderDay={dayRenderer}
                    onDateChange={handleOfficialDates}
                    onNextMonth={handleOfficialDates}
                    onPreviousMonth={handleOfficialDates}
                  />
                </div>
                <div className='items-center justify-between gap-3 border-t p-3 md:flex'>
                  <div className='hidden flex-col gap-1 md:flex'>
                    {officialDayRenderer()}
                  </div>
                  <div className='flex items-center gap-2'>
                    <div>
                      {numberOfNights !== null && numberOfNights > 0 && (
                        <span className='text-md rounded-2xl bg-gray-100 p-2 px-4 font-medium text-gray-700'>
                          {numberOfNights} gece
                        </span>
                      )}
                    </div>
                    <div>
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
                  </div>
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

export { HotelCalendar }
