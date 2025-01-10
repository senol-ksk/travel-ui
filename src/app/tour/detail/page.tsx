import { Suspense } from 'react'
import { TourDetailClient } from './client'

const TourDetailPage = () => {
  return (
    <div>
      <Suspense>
        <TourDetailClient />
      </Suspense>
    </div>
  )
}

export default TourDetailPage
