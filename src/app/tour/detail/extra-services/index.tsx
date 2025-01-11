import { useEffect, useState } from 'react'
import { ActionIcon } from '@mantine/core'
import { FiMinus, FiPlus } from 'react-icons/fi'

import { TourExtraServiceData } from '@/modules/tour/type'
import { upperFirst, useMounted } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'

type Props = {
  data: TourExtraServiceData
  maxCount: number
  onChange: ({ key, count }: { key: string; count: number }) => void
}

const ExtraServicePanel: React.FC<Props> = ({
  data,
  maxCount,
  onChange = () => null,
}) => {
  const [countState, setCount] = useState(0)
  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      onChange({
        key: data.key,
        count: countState,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countState, mounted])

  return (
    <div>
      <div className='flex gap-3 pb-2'>
        <div className='font-semibold'>
          {upperFirst(data.name.toLocaleLowerCase())}
        </div>
        <div>
          {formatCurrency(data.unitPrice.value, data.unitPrice?.currency)}
        </div>
      </div>
      <div className='flex'>
        <ActionIcon
          variant='default'
          size='lg'
          type='button'
          disabled={countState === 0}
          onClick={() => {
            setCount((prevCount) => {
              const nextCount = prevCount - 1
              // handleOnChange(nextCount)
              return nextCount
            })
          }}
        >
          <FiMinus />
        </ActionIcon>

        <div className='grid w-[50] items-center justify-center'>
          {countState}
        </div>

        <ActionIcon
          variant='default'
          size='lg'
          disabled={countState === maxCount}
          onClick={() => {
            setCount((prevCount) => {
              const nextCount = prevCount + 1
              // handleOnChange(nextCount)
              return nextCount
            })
          }}
        >
          <FiPlus />
        </ActionIcon>
      </div>
    </div>
  )
}

export { ExtraServicePanel }
