import { ClientFlightDataModel } from '@/modules/flight/types'

const filterList = [
  {
    title: 'Aktarma',
    filterKey: 'flightDetailSegments.length',
  },
]

export const flightFilter = (
  flights: ClientFlightDataModel[]
): ClientFlightDataModel[] => {
  return flights
}
