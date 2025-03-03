import { filterParsers, SortOrderEnums } from '@/modules/carrent/types'
import { CarSearchResultItemType } from '../types'
import { useQueryStates } from 'nuqs'

export const useFilterActions = (data: CarSearchResultItemType[]) => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)

  if (!data) return null

  const sortOrder = (data: CarSearchResultItemType[]) => {
    return data.sort((a, b) => {
      switch (order) {
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
    .filter((car) => {
      return filterParams.fuelTypes
        ? filterParams.fuelTypes?.includes(car.carDetail.fuelType)
        : true
    })
    .filter((car) => {
      return filterParams.transmission
        ? filterParams.transmission?.filter(
            (filter) =>
              (filter === 1 && car.carDetail.automaticTransmission) ||
              (filter === 0 && !car.carDetail.automaticTransmission)
          ).length
        : true
    })
    .filter((car) => {
      return filterParams.provider
        ? filterParams.provider.includes(car.carDetail.vendorName)
        : true
    })
    .filter((car) => {
      return filterParams.seatCount
        ? filterParams.seatCount.includes(car.carDetail.seatCount)
        : true
    })
    .filter((car) => {
      return filterParams.category
        ? filterParams.category.includes(car.carDetail.category)
        : true
    })
    .filter((car) => {
      return filterParams.brand
        ? filterParams.brand.includes(car.carDetail.name)
        : true
    })

  return filteredData
}
