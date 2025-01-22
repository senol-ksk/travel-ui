import { Suspense } from 'react'
import { HotelDetailSection } from './detail'

const HotelDetailPage = () => {
  return (
    <Suspense>
      <HotelDetailSection />
    </Suspense>
  )
}

export default HotelDetailPage
