import { NativeSelect } from '@mantine/core'
import { range } from '@mantine/hooks'
import clsx from 'clsx'

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
        'relative flex h-full flex-col rounded-md border border-transparent bg-gray-50 hover:border-blue-800',
        {
          'border-red-500': error,
          'border-slate-300': !error,
        }
      )}
    >
      <NativeSelect
        classNames={{
          label: 'text-sm leading-none',
          input: 'text-xl leading-none font-semibold h-auto min-h-auto pr-0',
          root: 'h-full truncate rounded-md bg-gray-50 px-5 py-2 md:px-6 border-slate-300',
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
