import { RangeSlider } from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'

import { formatCurrency } from '@/libs/util'
import { filterParser } from '@/modules/tour/searchResultParams'

type IProps = {
  minPrice: number
  maxPrice: number
}

const PriceRangeSlider: React.FC<IProps> = ({ maxPrice, minPrice }) => {
  const [values, setValues] = useState<[number, number]>([minPrice, maxPrice])
  const [{ priceRange }, setFilterParams] = useQueryStates(filterParser)

  useEffect(() => {
    if (priceRange) {
      setValues([priceRange[0], priceRange[1]])
    } else {
      setValues([minPrice, maxPrice])
    }
  }, [minPrice, maxPrice, priceRange])

  return (
    <RangeSlider
      thumbSize={26}
      size={3}
      min={minPrice}
      max={maxPrice}
      label={(value) => formatCurrency(value)}
      onChange={setValues}
      value={values}
      onChangeEnd={(value) => {
        setFilterParams({
          priceRange: value,
        })
      }}
    />
  )
}

export { PriceRangeSlider }
