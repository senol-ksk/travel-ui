'use client'

import { Container, Button, Image } from '@mantine/core'
import Link from 'next/link'
import { Widgets } from '@/types/cms-types'
import { useEffect, useState } from 'react'

const categories = [
  'Erken Rezervasyon',
  'Alanya Otelleri',
  'Kıbrıs Otelleri',
  'Bodrum Otelleri',
  'Belek Otelleri',
  'Kemer Otelleri',
  'başar otelleri',
]

type IProps = {
  data: Widgets
}

const TrendRegions: React.FC<IProps> = ({ data }) => {
  const [isEmblaInitialized, setIsEmblaInitialized] = useState(false)

  useEffect(() => {
    setIsEmblaInitialized(true)
  }, [])

  return (
    <Container className='mt-10'>
      <div>
        <h2 className='mb-6 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
          Trend Tatil Bölgeleri
        </h2>

        <Container className='mb-8 gap-2 overflow-x-auto md:overflow-x-visible'>
          <div className='flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center'>
            {categories.map((title, i) => (
              <Link href='#' key={i}>
                <Button variant='default' color='white' size='md' radius='md'>
                  {title}
                </Button>
              </Link>
            ))}
          </div>
        </Container>
        <div className='mb-4 grid grid-cols-2 gap-2 md:auto-rows-[200px] md:grid-cols-12 md:gap-5'>
          {data?.map((item, index) => {
            let colWidth = 'md:col-span-3'
            let rowLength = ''

            if (index === 0) {
              colWidth = 'md:col-span-3'
              rowLength = 'md:row-span-2'
            } else if (index === 1) {
              colWidth = 'md:col-span-2'
              rowLength = ''
            } else if (index === 2) {
              colWidth = 'md:col-span-4'
              rowLength = ''
            } else if (index === 3) {
              colWidth = 'md:col-span-3'
              rowLength = 'md:row-span-2'
            } else if (index === 4) {
              colWidth = 'md:col-span-3'
              rowLength = ''
            } else if (index === 5) {
              colWidth = 'md:col-span-3'
              rowLength = ''
            }

            return (
              <div
                key={item.id}
                className={`group col-span-6 ${colWidth} ${rowLength}`}
              >
                <Link
                  href={item.params.link?.value || '#'}
                  className='relative block h-full overflow-hidden rounded-3xl'
                >
                  <div className='h-full w-full overflow-hidden'>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                      alt={item.title}
                      className='h-full w-full object-cover brightness-75 transition-all duration-300 group-hover:brightness-100'
                    />
                  </div>
                  <div className='absolute right-0 bottom-0 left-0 truncate bg-gradient-to-t from-black/70 to-transparent p-3 text-lg font-medium text-white'>
                    {item.title}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}

export { TrendRegions }
