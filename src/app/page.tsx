import Image from 'next/image'
import { Suspense } from 'react'
import { Skeleton, Container } from '@mantine/core'

import { SearchEngine } from '@/components/search-engine/'

export default async function Home() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <div className='relative'>
        <Image
          src='https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg'
          fill
          alt='Fulltrip'
          priority
          className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
        />
        <div className='md:min-h-[300px] md:py-10'>
          <Container className='px-0 md:px-4'>
            <div className='bg-white md:rounded-lg md:border'>
              <SearchEngine />
            </div>
          </Container>
        </div>
      </div>
    </Suspense>
  )
}
