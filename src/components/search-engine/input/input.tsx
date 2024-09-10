import { FaUsers } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosCalendar } from 'react-icons/io'

import { useId } from '@mantine/hooks'

import clsx from 'clsx'

type Props = {
  label: string | React.ReactNode
  icon: 'location' | 'passenger' | 'calendar' | React.ReactElement
  title?: string | null | undefined
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
      className={clsx('grid rounded border', {
        'border-red-500 shadow-[0_0_0_1px] shadow-red-500': error,
        'border-slate-300': !error,
      })}
    >
      <label
        id={labelId}
        aria-labelledby={labelId}
        className={clsx(
          {
            'opacity-0': !title,
          },
          'absolute'
        )}
      >
        {label}
      </label>
      <button
        type='button'
        className='flex items-center justify-start gap-2 border-0 p-3 text-start leading-none md:gap-4 md:p-4'
        onClick={onClick}
        id={labelId}
      >
        <span
          className={clsx('text-lg', {
            'text-red-500': error,
          })}
        >
          {iconComponent}
        </span>
        <span>{!!title ? title : label}</span>
      </button>
    </div>
  )
}
