import { useQueryStates } from 'nuqs'
import { useState } from 'react'

import { formatCurrency } from '@/libs/util'
import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { Button, RangeSlider, TextInput } from '@mantine/core'

type IProps = {
  minPrice: ServicePriceType | undefined
  maxPrice: ServicePriceType | undefined
}

const PriceRangeSlider: React.FC<IProps> = ({ minPrice, maxPrice }) => {
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const [values, setValues] = useState<[number, number]>([
    filterParams.minPrice ?? minPrice?.value ?? 0,
    filterParams.maxPrice ?? maxPrice?.value ?? 10000,
  ])

  return (
    <>
      <RangeSlider
        value={values}
        min={minPrice?.value}
        max={maxPrice?.value}
        minRange={1000}
        step={1000}
        size={3}
        styles={{
          markLabel: { display: 'none' },
          mark: { display: 'none' },
        }}
        label={null}
        thumbSize={26}
        onChange={setValues}
      />
      <div className='pt-5'>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            <TextInput
              readOnly
              size='xs'
              label='En Düşük'
              value={formatCurrency(values[0])}
            />
          </div>
          <div>
            <TextInput
              readOnly
              size='xs'
              label='En Yüksek'
              value={formatCurrency(values[1])}
            />
          </div>
        </div>
      </div>

      <div className='pt-3 text-center'>
        <Button
          type='button'
          size='compact-sm'
          onClick={() => {
            if (values.length) {
              setFilterParams({
                minPrice: values[0],
                maxPrice: values[1],
              })
            }
          }}
        >
          Uygula
        </Button>
      </div>
    </>
  )
}

export { PriceRangeSlider }
