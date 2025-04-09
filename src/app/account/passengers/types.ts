export type SavePassengerServiceResponse = {
  _passengerId: ID
  birthDate: string
  calculationYearBased: boolean
  calculationYearType: number
  checkinDate: string
  citizenNo: string | number
  declaredAge: number
  email: string
  firstName: string
  flightFrequencyNo: string
  gender: number | string
  groupOrderIndex: number
  hesCode: null
  isContact: boolean
  isDontValidate: boolean
  isRecord: boolean
  lastName: string
  listFlightFrequencyAirline: string[]
  listFlightFrequencyNo: string[]
  middleName: null
  mobilePhoneNumber: string
  model_PassengerId: ID
  nationality_Check: null | boolean
  nationality: string
  notes: null
  passengerId: ID
  passengerKey: null
  passportCountry: string
  passportNo: null | string
  passportValidityDate: null | string | Date
  productType: number
  registeredPassengerId: ID
  sequenceNo: number
  type: number | string
  webUserId: ID
}
