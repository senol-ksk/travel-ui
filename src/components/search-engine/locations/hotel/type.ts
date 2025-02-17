type arrayNumber = Array<[number]>

export type LocationResult = {
  Id: ID
  ParentIds: number[]
  Name: string
  Code: string
  CountryCode: string
  Location: number[]
  Northeast: number[]
  Southwest: number[]
  Iata: string[]
  Type: number
  SubDestinations: LocationResult[]
  Slug: string
  Select: boolean
  IsDomestic: boolean
  ExtentionData: { [key: string]: string }
}

export type LocationResults = {
  Succeeded: boolean
  Result: Array<LocationResult>
  Errors: Array<[]>
  MessageEvents: Array<[]>
}
