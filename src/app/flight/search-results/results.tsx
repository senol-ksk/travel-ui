import { FlightSearchResultsApiResponse } from '../type'

type IProps = {
  data: FlightSearchResultsApiResponse[]
}

const FlightSearchResults: React.FC<IProps> = ({ data }) => {
  return data.map((page) => {
    return page?.data?.searchResults?.map((searchResult, searchResultIndex) => {
      return searchResult.flightFareInfos ? (
        <div key={searchResultIndex} className='grid gap-4'></div>
      ) : null
    })
  })
}

export { FlightSearchResults }
