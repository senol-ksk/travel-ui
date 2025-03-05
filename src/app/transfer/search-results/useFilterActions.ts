import { useQueryStates } from 'nuqs'
import { TransferVehicle } from '../types'
import {
  filterParsers,
  SortOrderEnums,
} from '@/modules/transfer/searchParams.client'

export const useFilterActions = (data: TransferVehicle[]) => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)

  const result = data
    .sort((a, b) => {
      const a_price = a.transferData.bookDetail.sortPrice
      const b_price = b.transferData.bookDetail.sortPrice

      switch (order) {
        case SortOrderEnums.priceAsc:
          return a_price - b_price

        case SortOrderEnums.priceDesc:
          return b_price - a_price

        default:
          return a_price - b_price
      }
    })
    .filter((transfer) => {
      const price = transfer.transferData.bookDetail.sortPrice

      if (filterParams?.priceRange) {
        return (
          price >= filterParams.priceRange[0] &&
          price <= filterParams.priceRange[1]
        )
      }
      return true
    })
    .filter((transfer) => {
      if (filterParams.vehicle) {
        return filterParams.vehicle.includes(transfer.vehicleType.toString())
      }

      return true
    })
    .filter((transfer) => {
      if (filterParams.pax) {
        return filterParams.pax.includes(transfer.transferInfo.transferMax.pax)
      }

      return true
    })

  return result
}
