import { NativeSelect } from '@mantine/core'
import { range } from '@mantine/hooks'
import clsx from 'clsx'
import { BsClock } from 'react-icons/bs'

type IProps = {
  error?: boolean
  label: React.ReactNode
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: string
}

const TransferHours: React.FC<IProps> = ({
  error = false,
  label,
  onChange,
  defaultValue,
}) => {
  const hourRange = range(0, 23).map((hour) => ({
    label: hour < 10 ? `0${hour}:00` : `${hour}:00`,
    value: hour < 10 ? `0${hour}:00` : `${hour}:00`,
  }))

  return (
    <div
      className={clsx(
        'relative flex h-14 flex-col rounded-md border border-gray-600 bg-white hover:border-blue-800',
        {
          'border-red-500 shadow-[0_0_0_1px] shadow-red-500': error,
          'border-gray-600': !error,
        }
      )}
    >
      <NativeSelect
        variant='unstyled'
        label={label}
        classNames={{
          label: 'text-sm leading-none font-normal',
          input: 'leading-none h-auto min-h-auto pr-0 px-3',
          root: 'h-14 truncate rounded-md px-5 md:px-6',
          section: 'hidden',
        }}
        data={hourRange}
        onChange={onChange}
        defaultValue={defaultValue ?? hourRange[0].value}
      />
    </div>
  )
}

export { TransferHours }
