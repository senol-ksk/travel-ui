import { BusSearchResultItem } from '@/app/bus/types'
import { filterParsers, SortOrderEnums } from '@/modules/bus/searchParams'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

const useFilterActions = (data: BusSearchResultItem[]) => {
  const [filterParams] = useQueryStates(filterParsers)
  const result = data

  return result
    .sort((a, b) => {
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
    .filter((data) => {
      return filterParams.type ? filterParams.type.includes(data.busType) : true
    })
    .filter((data) => {
      return filterParams.origin
        ? filterParams.origin.includes(data.originId.toString())
        : true
    })
    .filter((data) => {
      return filterParams.destination
        ? filterParams.destination.includes(data.destinationId.toString())
        : true
    })
    .filter((data) => {
      return filterParams.company
        ? filterParams.company.includes(data.companyId.toString())
        : true
    })
}

export { useFilterActions }
