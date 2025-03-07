import Image from 'next/image'
import { Suspense } from 'react'
import { Skeleton, Container, Title } from '@mantine/core'

import { SearchEngine } from '@/components/search-engine/'

export default async function Home() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <div className='relative'>
        <Title className='pt-13 text-center text-white [text-shadow:_0_0_1px_var(--mantine-color-dark-2)]'>
          FullTrip ile seyahat planlamak çok kolay
        </Title>
        <Image
          src='https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg'
          fill
          alt='Fulltrip'
          priority
          className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block'
        />
        <div className='md:min-h-[280px] md:py-10'>
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
