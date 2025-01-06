import { NativeSelect } from '@mantine/core'
import { range } from '@mantine/hooks'
import clsx from 'clsx'
import { BsClock } from 'react-icons/bs'

type IProps = {
  error?: boolean
  label: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue: string
}

const CarHours: React.FC<IProps> = ({
  error = false,
  label,
  onChange,
  defaultValue,
}) => {
  return (
    <div
      className={clsx(
        'relative flex h-[54px] items-center overflow-hidden text-ellipsis text-nowrap rounded border leading-none',
        {
          'border-red-500 shadow-[0_0_0_1px] shadow-red-500': error,
          'border-slate-300': !error,
        }
      )}
    >
      <div className='absolute start-8 top-2 block pb-1 text-xs text-gray-500'>
        {label}
      </div>
      <NativeSelect
        variant='unstyled'
        className='w-full'
        label
        leftSection={<BsClock />}
        classNames={{
          root: 'p-0 h-full',
          input: 'ps-8 h-full pt-3 text-inherit',
          wrapper: 'h-full',
          label: 'sr-only',
        }}
        data={range(0, 23).map((hour) => ({
          label: hour < 10 ? `0${hour}:00` : `${hour}:00`,
          value: hour < 10 ? `0${hour}:00` : `${hour}:00`,
        }))}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </div>
  )
}

export { CarHours }
