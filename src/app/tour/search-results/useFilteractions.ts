import { slugify } from '@/libs/util'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import {
  TourSearchResultGroupedItem,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

const today = dayjs()

const useFilterActions = (
  data: (TourSearchResultGroupedItem | undefined)[]
) => {
  const [{ order, ...filterParams }] = useQueryStates(filterParser)

  // if (!data || !data.length) return null

  const copyData = data
  const results = copyData

  return results
    ?.sort((a, b) => {
      const a_startDate = dayjs(a?.startDate)
      const b_startDate = dayjs(b?.startDate)
      const a_totalPrice = a?.totalPrice.value ?? 0
      const b_totalPrice = b?.totalPrice.value ?? 0

      switch (order) {
        case SortOrderEnums.priceAsc:
          return a_totalPrice - b_totalPrice
        case SortOrderEnums.priceDesc:
          return b_totalPrice - a_totalPrice
        case SortOrderEnums.dateAsc:
          return a_startDate.diff(today) - b_startDate.diff(today)
        case SortOrderEnums.dateDesc:
          return b_startDate.diff(today) - a_startDate.diff(today)

        default:
          return a_totalPrice - b_totalPrice
      }
    })
    .filter((tourData) => {
      const price = tourData?.tlPrice.value ?? 0
      if (filterParams.priceRange) {
        return (
          price >= filterParams.priceRange[0] &&
          price <= filterParams.priceRange[1]
        )
      }
      return true
    })
    .filter((tourData) => {
      if (filterParams.nightCount && tourData?.tourTime) {
        return filterParams.nightCount.includes(tourData?.tourTime)
      }

      return true
    })
    .filter((tourData) => {
      const regionSlug = slugify(tourData?.region.title ?? '')
      if (filterParams.regions) {
        return filterParams.regions.includes(regionSlug)
      }
      return true
    })
}

export { useFilterActions }
