type arrayNumber = Array<[number]>

export type LocationResult = {
  Id: ID
  ParentIds: arrayNumber
  Name: string
  Code: string
  CountryCode: string
  Location: arrayNumber
  Northeast: arrayNumber
  Southwest: arrayNumber
  Iata: string[]
  Type: number
  SubDestinations: LocationResult[]
  Slug: string
  Select: boolean
  IsDomestic: boolean
  ExtentionData: object
}

export type LocationResults = {
  Succeeded: boolean
  Result: Array<LocationResult>
  Errors: Array<[]>
  MessageEvents: Array<[]>
}
