import { Widgets } from '@/types/cms-types'
import { AspectRatio, Image, Loader } from '@mantine/core'
import { cdnImageUrl } from '@/libs/cms-data'
import { MdLocalHotel } from 'react-icons/md'

type IProps = {
  data: Widgets
  moduleName: string
  ıcon: React.ComponentType<{ size?: number; className?: string }>
}

export const Loaderbanner = ({ data, moduleName, ıcon }: IProps) => {
  return (
    <div className='grid items-center justify-center rounded-md border bg-white p-2 md:gap-5'>
      <div className='flex items-center justify-center gap-2'>
        <div className='relative items-baseline'>
          <Loader className='mt-2 text-blue-800' size='lg' />

          <ıcon
            size={20}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-blue-800'
          />
        </div>
        <div className='text-center font-bold text-blue-800 md:text-lg'>
          {' '}
          {moduleName} hazırlanıyor, lütfen bekleyiniz...
        </div>
      </div>
      {data?.map((item, index) => (
        <div key={item.id}>
          <AspectRatio ratio={2.6 / 1}>
            <Image
              loading='lazy'
              //  fallbackSrc='/default-room.jpg'
              src={cdnImageUrl(item.params.image.value)}
              alt={item.title}
              radius='md'
              fit='cover'
              className='h-full w-full'
            />
          </AspectRatio>
        </div>
      ))}
    </div>
  )
}
