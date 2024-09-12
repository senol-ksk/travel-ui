import { Container } from '@mantine/core'

import { SearchEngine } from '@/components/search-engine/'

export default function Home() {
  return (
    <div
      className='flex min-h-[228px] flex-col justify-center p-2 md:p-4'
      style={{
        background:
          'url(https://ykmturizm.mncdn.com/11/Files/638575144464859102.jpg) no-repeat ',
      }}
    >
      <div className='container rounded-md bg-white'>
        <SearchEngine />
      </div>
    </div>
  )
}
