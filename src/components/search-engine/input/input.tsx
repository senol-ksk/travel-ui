import { FaUsers } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosCalendar } from 'react-icons/io'

import { useId } from '@mantine/hooks'

import clsx from 'clsx'

type Props = {
  label: string | React.ReactNode
  icon: 'location' | 'passenger' | 'calendar' | React.ReactElement
  title?: string | null
  onClick?: () => void
  error?: boolean
}

export const Input: React.FC<Props> = ({
  label,
  icon,
  title,
  onClick,
  error,
}) => {
  let iconComponent = <FaLocationDot />
  const labelId = useId()

  switch (icon) {
    case 'location':
      iconComponent = <FaLocationDot />
      break
    case 'calendar':
      iconComponent = <IoIosCalendar />
      break
    case 'passenger':
      iconComponent = <FaUsers />
      break
    default:
      iconComponent = icon
  }

  return (
    <div
      className={clsx(
        'relative flex h-[54px] items-center overflow-hidden text-ellipsis text-nowrap rounded border p-1 leading-none',
        {
          'border-red-500 shadow-[0_0_0_1px] shadow-red-500': error,
          'border-slate-300': !error,
        }
      )}
    >
      <div className='flex h-full w-full items-center gap-2'>
        <div
          className={clsx('ps-1 text-lg', {
            'text-red-500': error,
          })}
        >
          {iconComponent}
        </div>
        <div className='overflow-hidden overflow-ellipsis'>
          <label
            id={labelId}
            aria-labelledby={labelId}
            className={clsx(
              {
                'sr-only': !title,
              },
              'relative block pb-1 text-xs text-gray-500'
            )}
          >
            {label}
          </label>
          <div className='overflow-hidden overflow-ellipsis'>
            {!!title ? title : label}
          </div>
        </div>
      </div>

      <button
        type='button'
        className='absolute bottom-0 end-0 start-0 top-0 z-10 flex h-full w-full'
        onClick={onClick}
        id={labelId}
      />
    </div>
  )
}
