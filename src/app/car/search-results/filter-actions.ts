import { filterParsers, SortOrderEnums } from '@/modules/carrent/types'
import { CarSearchResultItemType } from '../types'
import { useQueryStates } from 'nuqs'

export const useFilterActions = (data: CarSearchResultItemType[]) => {
  const [filterParams, setFilterParams] = useQueryStates(filterParsers)

  if (!data) return null

  const sortOrder = (data: CarSearchResultItemType[]) => {
    return data.sort((a, b) => {
      switch (filterParams.order) {
        case SortOrderEnums.priceAsc:
          return a.totalPrice.value - b.totalPrice.value
        case SortOrderEnums.priceDesc:
          return b.totalPrice.value - a.totalPrice.value
        default:
          return a.totalPrice.value - b.totalPrice.value
      }
    })
  }

  const filteredData = sortOrder(data)

  return filteredData
}
