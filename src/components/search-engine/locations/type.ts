type arrayNumber = Array<number>

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
  ExtentionData: { [key: string]: string }
}

export type LocationResults = {
  Succeeded: true
  Result: LocationResult[]
  Errors: Array<[]>
  MessageEvents: Array<[]>
}
