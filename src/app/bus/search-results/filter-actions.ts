import { BusSearchResultItem } from '@/app/bus/types'
import { filterParsers, SortOrderEnums } from '@/modules/bus/searchParmas'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

const useFilterActions = (data: BusSearchResultItem[]) => {
  const [filterParams] = useQueryStates(filterParsers)

  return data.sort((a, b) => {
    const a_departureDate = dayjs(a.bus.departureDate)
    const a_departureDiff = a_departureDate.diff(dayjs(), 'millisecond')

    const b_departureDate = dayjs(b.bus.departureDate)
    const b_departureDiff = b_departureDate.diff(dayjs(), 'millisecond')

    switch (filterParams.order) {
      case SortOrderEnums.priceDesc:
        return b.totalPrice.value - a.totalPrice.value
      case SortOrderEnums.hourAsc:
        return a_departureDiff - b_departureDiff

      default:
        return a.totalPrice.value - b.totalPrice.value
    }
  })
}

export { useFilterActions }
