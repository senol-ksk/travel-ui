import { Suspense } from 'react'
import { Skeleton, BackgroundImage } from '@mantine/core'

import { SearchEngine } from '@/components/search-engine/'

export default async function Home() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <div className='relative'>
        <BackgroundImage
          src='https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg'
          className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
        />
        <div className='flex min-h-[228px] flex-col justify-center p-0 md:p-4'>
          <div className='lg:container'>
            <div className='bg-white md:rounded-lg md:border'>
              <SearchEngine />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
