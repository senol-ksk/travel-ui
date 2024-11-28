type ID = string | number
type arrayNumber = Array<[number]>

export type HotelLocationResult = {
  Id: ID
  ParentIds: ID | null
  Name: string
  Code: string
  CountryCode: string
  Continent: null
  Location: null
  Northeast: null
  Southwest: null
  Iata: []
  Type: 1
  SubDestinations: [
    {
      Id: ID
      ParentIds: ID[]
      Name: string
      Code: string
      CountryCode: string
      Continent: null
      Location: [number, number]
      Northeast: null
      Southwest: null
      Iata: []
      Type: number
      SubDestinations: []
      Slug: string
      Select: true
      IsDomestic: true
      ExtentionData: {
        [key: string]: string
      } | null
    },
  ]
  Slug: null | string
  Select: boolean
  IsDomestic: boolean
  ExtentionData: { [key: string]: string } | null
}

export type HotelLocationResults = {
  Succeeded: boolean
  Result: Array<HotelLocationResult>
  Errors: Array<[]>
  MessageEvents: Array<[]>
}
