import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

const today = dayjs()

const useFilterActions = (data: TourSearchResultSearchItem[]) => {
  const [{ order, ...filterParams }] = useQueryStates(filterParser)

  const results = data.sort((a, b) => {
    const a_startDate = dayjs(a.startDate)
    const b_startDate = dayjs(b.startDate)

    switch (order) {
      case SortOrderEnums.priceAsc:
        return a.totalPrice.value - b.totalPrice.value
      case SortOrderEnums.priceDesc:
        return b.totalPrice.value - a.totalPrice.value
      case SortOrderEnums.dateAsc:
        return a_startDate.diff(today) - b_startDate.diff(today)
      case SortOrderEnums.dateDesc:
        return b_startDate.diff(today) - a_startDate.diff(today)

      default:
        return a.totalPrice.value - b.totalPrice.value
    }
  })

  return results
}

export { useFilterActions }
