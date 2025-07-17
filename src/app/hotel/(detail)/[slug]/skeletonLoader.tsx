import { Skeleton } from '@mantine/core'

const HotelDetailSkeleton = () => {
  return (
    <div className='grid gap-3 p-4 lg:container'>
      <Skeleton h={15} maw={500} />
      <Skeleton h={140} />

      <Skeleton h={15} maw={500} />
      <Skeleton h={15} maw={540} />
      <Skeleton h={15} maw={590} />
    </div>
  )
}

export { HotelDetailSkeleton }
