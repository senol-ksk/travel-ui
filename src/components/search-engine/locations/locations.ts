type ID = string | number
type arrayNumber = Array<[number]>

type LocationResult = {
  Id: ID
  ParentIds: arrayNumber
  Name: string
  Code: string
  CountryCode: string
  Location: arrayNumber
  Northeast: arrayNumber
  Southwest: arrayNumber
  Iata: Array<[]>
  Type: number
  SubDestinations: Array<{
    Id: ID
    ParentIds: arrayNumber
    Name: string
    Code: string
    CountryCode: string
    Location: arrayNumber
    Northeast: arrayNumber
    Southwest: arrayNumber
    Iata: Array<[]>
    Type: number
    SubDestinations: Array<[]>
    Slug: string
    Select: boolean
    IsDomestic: boolean
    ExtentionData: object
  }>
  Slug: string
  Select: boolean
  IsDomestic: boolean
  ExtentionData: object
}

export type LocationsApiResults = {
  Succeeded: true
  Result: Array<LocationResult>
  Errors: Array<[]>
  MessageEvents: Array<[]>
}
