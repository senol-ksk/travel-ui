import { filterParsers } from '@/modules/transfer/searchParams.client'
import { RangeSlider } from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'

type IProps = {
  minPrice: number
  maxPrice: number
  defaultValue?: number[] | undefined | null
}

const PriceRangeSlider: React.FC<IProps> = ({ minPrice, maxPrice }) => {
  const [{ priceRange }, setFilterParams] = useQueryStates(filterParsers)

  const [values, setValues] = useState<[number, number]>([minPrice, maxPrice])

  useEffect(() => {
    // on filter clear we need to set price range values to defaults
    if (priceRange) {
      setValues([priceRange[0], priceRange[1]])
    } else {
      setValues([minPrice, maxPrice])
    }
  }, [maxPrice, minPrice, priceRange])

  return (
    <RangeSlider
      thumbSize={26}
      size={3}
      min={minPrice}
      max={maxPrice}
      value={values}
      label={null}
      onChangeEnd={(values) => {
        setFilterParams({
          priceRange: [values[0], values[1]],
        })
      }}
      onChange={setValues}
    />
  )
}

export { PriceRangeSlider }
