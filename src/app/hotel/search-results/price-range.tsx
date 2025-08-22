import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'

import { formatCurrency } from '@/libs/util'
import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { Button, RangeSlider, TextInput } from '@mantine/core'

type IProps = {
  minPrice: number
  maxPrice: number
  defaultRanges: [number, number]
}

const PriceRangeSlider: React.FC<IProps> = ({
  minPrice,
  maxPrice,
  defaultRanges,
}) => {
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const [values, setValues] = useState<[number, number]>([minPrice, maxPrice])

  useEffect(() => {
    if (!filterParams.priceRange) {
      setValues(defaultRanges)
    }
  }, [defaultRanges, filterParams])

  return (
    <>
      <RangeSlider
        className='px-2'
        value={values}
        min={defaultRanges[0]}
        max={defaultRanges[1]}
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
              label='En Düşük'
              value={formatCurrency(values[0])}
            />
          </div>
          <div>
            <TextInput
              readOnly
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
                priceRange: values,
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
