import { Suspense } from 'react'
import { Flight as FlightSearchEngine } from './flight'

export const Flight = () => {
  return (
    <Suspense>
      <FlightSearchEngine />
    </Suspense>
  )
}

// export { Flight } from './flight'
