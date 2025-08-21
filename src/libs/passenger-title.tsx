import {
  FlightPassengerTypes,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'

export const convertPassengerTitle = (
  passengerType:
    | PassengerTypesIndexEnum
    | FlightPassengerTypes
    | PassengerTypesEnum
) => {
  switch (passengerType) {
    case 0:
      return 'Yetişkin'
    case 1:
      return 'Çocuk'
    case 2:
      return 'Bebek'

    default:
      return PassengerTypesIndexEnum[passengerType]
  }
}
