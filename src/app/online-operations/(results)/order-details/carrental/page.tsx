import { Suspense } from 'react'
import { CarRentalBookDetail } from './_components/detail'

export default function CarRentalBookDetailPage() {
  return (
    <Suspense>
      <CarRentalBookDetail />
    </Suspense>
  )
}
