import { Image } from '@mantine/core'
import Link from 'next/link'
import { Widgets } from '@/types/cms-types'
import { Route } from 'next'

type IProps = {
  data: Widgets
}

const TrendRegions: React.FC<IProps> = ({ data }) => {
  return (
    <div className='grid grid-cols-2 gap-2 md:auto-rows-[200px] md:grid-cols-12 md:gap-5'>
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
            className={`group col-span-6 ${colWidth} ${rowLength} rounded-3xl`}
          >
            <Link
              href={item.params.link?.value as Route}
              className='relative block h-full overflow-hidden rounded-3xl shadow-xl'
            >
              <div className='h-full w-full overflow-hidden'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${item.params.image?.value}`}
                  alt={item.title}
                  className='h-full w-full object-cover transition-all duration-400 hover:scale-110'
                />
              </div>
              <div className='pointer-events-none absolute right-0 bottom-0 left-0 flex h-28 items-end truncate bg-gradient-to-t from-black/90 to-transparent p-3 text-xl font-medium text-white'>
                {item.title}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export { TrendRegions }
