import { Suspense } from 'react'
import { HotelDetailSection } from './detail'

const HotelDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params

  return (
    <Suspense>
      <HotelDetailSection slug={slug} />
    </Suspense>
  )
}

export default HotelDetailPage
