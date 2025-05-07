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
      className={clsx('relative flex h-full flex-col rounded-md bg-gray-50', {
        'border-red-500 shadow-[0_0_0_1px] shadow-red-500': error,
        'border-slate-300': !error,
      })}
    >
      <NativeSelect
        classNames={{
          label: 'text-sm leading-none',
          input: 'text-xl leading-none font-bold h-auto min-h-auto pr-0',
          root: 'h-full truncate rounded-md bg-gray-50 px-5 py-2 md:px-6 border-slate-300',
          section: 'hidden',
        }}
        variant='unstyled'
        label={label}
        // rightSection={<div></div>}
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
