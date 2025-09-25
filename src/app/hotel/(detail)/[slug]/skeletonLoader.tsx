import { Skeleton, Container, Title } from '@mantine/core'

const HotelDetailSkeleton = () => {
  return (
    <>
      <Container className='flex flex-col gap-3 px-0 py-5 sm:px-4 md:gap-5 md:py-3'>
        <div>
          <div className='grid auto-cols-fr gap-4 sm:grid-cols-4 md:grid-rows-2'>
            <Skeleton className='aspect-16/9 h-full w-full rounded-md sm:col-start-[span_2] sm:row-start-[span_2]' />
            {[1, 2, 3, 4].map((index) => (
              <Skeleton
                key={index}
                className='aspect-16/9 h-full w-full rounded-md sm:col-start-[span_1] sm:row-start-[span_1]'
              />
            ))}
          </div>
        </div>
        <div className='grid grid-cols-2 gap-2 rounded bg-gray-50 md:grid-cols-12 md:gap-5 md:p-3'>
          <div className='col-span-12 flex flex-col gap-7 rounded bg-white p-3 md:col-span-8'>
            <div className='grid'>
              <Skeleton h={32} w='80%' className='mb-2' />
              <div className='gap-md flex items-center py-2 text-sm text-blue-800'>
                <div className='flex gap-1'>
                  <Skeleton h={20} w={20} />
                  <Skeleton h={16} w={100} />
                </div>
                <div className='flex gap-1'>
                  <Skeleton h={22} w={22} />
                  <Skeleton h={16} w={80} />
                </div>
              </div>
            </div>
            <div>
              <Skeleton h={20} w={120} className='mb-4' />
              <Skeleton h={60} w='100%' className='mb-4' />

              <Skeleton h={20} w={140} className='mb-4' />
              <div className='grid grid-cols-2 gap-4 text-sm sm:grid-cols-4'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div key={index} className='flex items-center'>
                    <Skeleton h={16} w={16} className='mr-1' />
                    <Skeleton h={16} w={80} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-span-12 flex flex-col gap-3 md:col-span-4'>
            <div className='hidden items-center justify-between rounded bg-white p-3 md:flex'>
              <div className='hidden items-center gap-2 self-end text-blue-800 md:flex'>
                <Skeleton
                  h={16}
                  w={16}
                  className='rounded-md bg-blue-100 p-4 px-5'
                />
                <Skeleton h={20} w={100} />
              </div>
              <div className='flex items-center'>
                <Skeleton h={16} w={120} />
                <Skeleton h={20} w={20} />
              </div>
            </div>
            <div className='hidden gap-3 rounded bg-white p-3 md:grid'>
              <div className='col-span-4 hidden gap-3 md:flex'>
                <Skeleton h={110} w={116} className='rounded-md' />
                <div className='grid'>
                  <Skeleton h={16} w={60} className='mb-2' />
                  <Skeleton h={14} w={120} className='mb-2' />
                  <div className='flex items-center'>
                    <Skeleton h={14} w={100} />
                    <Skeleton h={20} w={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden justify-between gap-5 rounded bg-white px-6 py-3 md:flex'>
              <div className='flex items-center gap-2'>
                <Skeleton h={24} w={24} />
                <div>
                  <Skeleton h={16} w={60} className='mb-1' />
                  <Skeleton h={14} w={80} />
                </div>
              </div>
              <div className='flex items-center gap-2 border-s ps-5'>
                <Skeleton h={24} w={24} />
                <div>
                  <Skeleton h={16} w={70} className='mb-1' />
                  <Skeleton h={14} w={80} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export { HotelDetailSkeleton }
