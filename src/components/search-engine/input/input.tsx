import { FaUsers } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosCalendar } from 'react-icons/io'

import { useId } from '@mantine/hooks'

import clsx from 'clsx'
import { UnstyledButton } from '@mantine/core'

type Props = {
  label: string | React.ReactNode
  title?: string | React.ReactNode | null
  onClick?: () => void
  error?: boolean
}

export const Input: React.FC<Props> = ({ label, title, onClick, error }) => {
  const labelId = useId()

  return (
    <div
      className={clsx(
        'relative flex h-full items-center truncate rounded-md border bg-gray-50 px-1 py-2 transition-colors hover:border-blue-800',
        {
          'border-red-500': error,
          'border-transparent': !error,
        }
      )}
    >
      <div className='px-7'>
        <label
          id={labelId}
          aria-labelledby={labelId}
          className={clsx(
            {
              'sr-only': !title,
            },
            'relative block pb-1 text-sm leading-none'
          )}
        >
          {label}
        </label>
        <div className='text-lg leading-none font-medium'>
          {!!title ? title : label}
        </div>
      </div>

      <UnstyledButton
        type='button'
        className='absolute start-0 end-0 top-0 bottom-0 z-10 h-full w-full'
        onClick={onClick}
        id={labelId}
      />
    </div>
  )
}
