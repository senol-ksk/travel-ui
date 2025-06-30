import { OfficialHolidayServiceResponse } from '@/types/global'
import { useOfficialHolidayQuery } from './useOfficialHolidayQuery'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DatePickerProps } from '@mantine/dates'
import { Indicator, Tooltip } from '@mantine/core'

const useOfficialDays = ({
  numberOfColumns = 2,
}: {
  numberOfColumns: number
}) => {
  const officialDayQuery = useOfficialHolidayQuery()
  const [officialDays, setOfficialDays] =
    useState<OfficialHolidayServiceResponse['result']>()

  const handleOfficialDates = useCallback(
    (date: string) => {
      const dateObj = [
        dayjs(date).add(numberOfColumns > 1 ? 1 : 0, 'month'),
        numberOfColumns > 1 ? dayjs(date) : undefined,
      ]

      const officialDays = officialDayQuery.data?.result.filter(
        (officialDay) => {
          return dateObj.find((month) => {
            return (
              month?.year() === dayjs(officialDay.day).year() &&
              dayjs(officialDay.day).month() == month.month()
            )
          })
        }
      )
      setOfficialDays(officialDays)
    },
    [numberOfColumns, officialDayQuery.data?.result]
  )
  const dayRenderer: DatePickerProps['renderDay'] = (date) => {
    const day = dayjs(date)
    const officialDayDates = dayjs(
      officialDayQuery.data?.result.find((officialDay) =>
        dayjs(officialDay.day).isSame(day)
      )?.day ?? null
    )
    const officialDay = officialDayQuery.data?.result.find((officialDay) =>
      dayjs(officialDay.day).isSame(day)
    )

    return (
      <Tooltip
        label={officialDay?.description}
        disabled={officialDayDates.date() !== day.date()}
        withArrow
        transitionProps={{
          transition: 'fade-down',
        }}
        offset={12}
      >
        <Indicator
          size={8}
          color='blue'
          offset={-1}
          disabled={officialDayDates.date() !== day.date()}
          position='bottom-center'
        >
          {day.date()}
        </Indicator>
      </Tooltip>
    )
  }

  useEffect(() => {
    handleOfficialDates(dayjs().toISOString())
  }, [handleOfficialDates])

  const officialDayRenderer = () => {
    return officialDays?.map((officialDay) => {
      return (
        <div key={officialDay.id} className='ps-4'>
          <Indicator position='middle-start' offset={-10}>
            <div className='text-sm'>
              {dayjs(officialDay.day).format('DD MMMM')}{' '}
              {officialDay.description}
            </div>
          </Indicator>
        </div>
      )
    })
  }

  return {
    dayRenderer,
    handleOfficialDates,
    officialDays,
    officialDayRenderer,
  }
}

export { useOfficialDays }
