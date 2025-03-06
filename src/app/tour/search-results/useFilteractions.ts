import { slugify } from '@/libs/util'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

const today = dayjs()

const useFilterActions = (data: TourSearchResultSearchItem[]) => {
  const [{ order, ...filterParams }] = useQueryStates(filterParser)

  const copyData = data
  const results = copyData

  return results
    .sort((a, b) => {
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
    .filter((tourData) => {
      const price = tourData.tlPrice.value
      if (filterParams.priceRange) {
        return (
          price >= filterParams.priceRange[0] &&
          price <= filterParams.priceRange[1]
        )
      }
      return true
    })
    .filter((tourData) => {
      if (filterParams.nightCount) {
        return filterParams.nightCount.includes(tourData.tourTime)
      }

      return true
    })
    .filter((tourData) => {
      const regionSlug = slugify(tourData.region.title)
      if (filterParams.regions) {
        return filterParams.regions.includes(regionSlug)
      }
      return true
    })
}

export { useFilterActions }
