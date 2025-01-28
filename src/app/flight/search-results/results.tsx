import { FlightSearchResultsApiResponse } from '../type'

type IProps = {
  data: FlightSearchResultsApiResponse[]
}

const FlightSearchResults: React.FC<IProps> = ({ data }) => {
  return data.map((page) => {
    return page.data?.searchResults.map((searchResult, searchResultIndex) => {
      return searchResult.flightFareInfos ? (
        <div key={searchResultIndex} className='grid gap-4'>
          {Object.keys(searchResult.flightFareInfos)
            .sort(
              (a, b) =>
                searchResult.flightFareInfos[a].totalPrice.value -
                searchResult.flightFareInfos[b].totalPrice.value
            )
            .map((flightFareInfoKey) => {
              const flightData = searchResult.flightFareInfos[flightFareInfoKey]

              const details = flightData.flightDetailKeys.map(
                (flightDetailKey) => {
                  return searchResult.flightDetails[flightDetailKey]
                }
              )

              const segments = details
                .at(0)
                ?.flightSegmentKeys.map((flightDetailKey) => {
                  return searchResult.flightDetailSegments[flightDetailKey]
                })
              // console.log('flightData', flightData)
              // console.log('details', details)
              // console.log('segments', segments)

              return (
                <div
                  key={flightFareInfoKey}
                  className={'rounded-lg border border-gray-300 p-3'}
                >
                  {flightData?.totalPrice.value}
                  <div>{/* {details.at(0).} */}</div>
                </div>
              )
            })}
        </div>
      ) : null
    })
  })
}

export { FlightSearchResults }
