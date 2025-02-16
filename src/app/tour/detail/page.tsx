import { Suspense } from 'react'
import { TourDetailClient } from './client'

const TourDetailPage = () => {
  return (
    <Suspense>
      <TourDetailClient />
    </Suspense>
  )
}

export default TourDetailPage
