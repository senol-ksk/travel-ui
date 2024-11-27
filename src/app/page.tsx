import { SearchEngine } from '@/components/search-engine/'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={'Loading...'}>
      <div
        className='flex min-h-[228px] flex-col justify-center bg-cover p-2 md:p-4'
        style={{
          backgroundImage:
            'url(https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg)',
        }}
      >
        <div className='md:container'>
          <div className='rounded-lg border bg-white'>
            <SearchEngine />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
