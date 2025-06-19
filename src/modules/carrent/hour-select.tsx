import { NativeSelect } from '@mantine/core'
import { range } from '@mantine/hooks'
import clsx from 'clsx'

type IProps = {
  error?: boolean
  label: React.ReactNode
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
        'relative flex h-14 flex-col rounded-md border border-gray-600 hover:border-blue-800',
        {
          'border-red-500': error,
          'border-gray-600': !error,
        }
      )}
    >
      <NativeSelect
        classNames={{
          label: ' font-normal',
          input: 'leading-none h-auto min-h-auto pr-0 px-3',
          root: ' rounded-md bg-white p-1 px-5 md:px-6',
          section: 'hidden',
        }}
        variant='unstyled'
        label={label}
        data={range(0, 23).map((hour) => ({
          label: hour < 10 ? `0${hour}:00` : `${hour}:00`,
          value: hour < 10 ? `0${hour}:00` : `${hour}:00`,
        }))}
        onChange={onChange}
        defaultValue={defaultValue ?? '00:00'}
      />
    </div>
  )
}

export { CarHours }
