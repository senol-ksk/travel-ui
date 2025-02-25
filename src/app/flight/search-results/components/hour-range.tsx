'use client'

import { RangeSlider, UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { LuSun } from 'react-icons/lu'
import { BsSunsetFill } from 'react-icons/bs'
import { BsMoonStarsFill } from 'react-icons/bs'

type Range = {
  value: number
  hourValue: number
  label: string
}

const hours = [...Array(48)].map((e, i) => {
  return (
    (i / 2 < 10 ? '0' : '') +
    (i / 2 - ((i / 2) % 1)) +
    ((i / 2) % 1 != 0 ? ':30' : ':00')
  )
})

const marks: Range[] = [
  ...hours.map((hour, hourIndex) => {
    const hourValue = hour.split(':').map(Number)

    return {
      value: hourIndex,
      hourValue: hourValue[0] * 60 + hourValue[1],
      label: hour,
    }
  }),
  { value: hours.length, hourValue: 1439, label: '23:59' },
]

const morningRange = [
  marks.find((value) => value.label === '05:00'),
  marks.find((value) => value.label === '12:00'),
] as Range[]

const afternoonRange = [
  marks.find((value) => value.label === '12:00'),
  marks.find((value) => value.label === '18:00'),
] as Range[]
const eveningRange = [
  marks.find((value) => value.label === '18:00'),
  marks.find((value) => value.label === '23:59'),
] as Range[]

const definedRanges = [
  {
    range: morningRange,
    id: 0,
    order: 0,
    label: 'Sabah',
    icon: <LuSun size={24} />,
  },
  {
    range: afternoonRange,
    id: 1,
    order: 1,
    label: 'Öğleden sonra',
    icon: <BsSunsetFill size={24} />,
  },
  {
    range: eveningRange,
    id: 2,
    order: 2,
    label: 'Akşam',
    icon: <BsMoonStarsFill size={18} />,
  },
]

type IProps = {
  onChange: (arg: Range[]) => void
  filterParams?: number[] | null
}

const HourRangeSlider: React.FC<IProps> = ({
  onChange = () => {},
  filterParams,
}) => {
  const lastItemInHourIndex = hours.length - 1
  const receivedValues = marks.filter(
    (mark) => filterParams && filterParams?.includes(mark.hourValue)
  )

  const [values, setValues] = useState<[number, number]>([
    receivedValues.length > 0 ? receivedValues[0]?.value : 0,
    receivedValues.length > 0 ? receivedValues[1].value : lastItemInHourIndex,
  ])

  // reset values when new search is initialized
  useEffect(() => {
    if (
      !receivedValues.length &&
      values[0] !== 0 &&
      values[1] !== lastItemInHourIndex
    ) {
      setValues([0, lastItemInHourIndex])
    }
  }, [lastItemInHourIndex, receivedValues, values])

  return (
    <div>
      <div className='flex gap-1 pb-3'>
        <div>{marks.find((mark) => mark.value === values?.[0])?.label}</div>
        <div>-</div>
        <div>{marks.find((mark) => mark.value === values?.[1])?.label}</div>
      </div>
      <RangeSlider
        thumbSize={26}
        size={3}
        min={0}
        max={marks.at(-1)?.value}
        label={null}
        minRange={1}
        styles={{
          markLabel: { display: 'none' },
          mark: { display: 'none' },
        }}
        marks={marks}
        onChange={setValues}
        onChangeEnd={(value) => {
          const selectedRange = marks.filter((mark) =>
            value.includes(mark.value)
          )

          onChange(selectedRange)
        }}
        value={values}
      />
      <div className='grid grid-cols-2 gap-3 pt-6'>
        {definedRanges
          .sort((a, b) => a.order - b.order)
          .map((definedTime) => {
            const ranges = definedTime.range
            const isActive =
              ranges[0].value === values[0] && ranges[1].value === values[1]

            return (
              <UnstyledButton
                key={definedTime.id}
                type='button'
                onClick={() => {
                  onChange(ranges)
                  setValues([ranges[0].value, ranges[1].value])
                }}
                className={clsx(
                  'rounded border border-gray-500 p-1 text-center text-xs leading-none text-gray-700 transition-colors',
                  {
                    'bg-primary border-primary-100 text-white': isActive,
                  }
                )}
              >
                <div className='flex justify-center'>
                  <div>{definedTime.icon}</div>
                </div>
                <div className='py-1'>{definedTime.label}</div>
                <div>
                  ({ranges[0].label}-{ranges[1].label})
                </div>
              </UnstyledButton>
            )
          })}
      </div>
    </div>
  )
}
export { HourRangeSlider }
