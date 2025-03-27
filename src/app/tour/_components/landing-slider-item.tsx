import { Link } from 'next-view-transitions'
import { Image } from '@mantine/core'
import NextImage from 'next/image'

type IProps = {
  href: string
  imageSrc: string
  title: string
}

const LandingSliderItem: React.FC<IProps> = ({ href, imageSrc, title }) => {
  return (
    <div className='relative'>
      <Link href={href}>
        <div className='relative size-[200px]'>
          <Image
            component={NextImage}
            src={imageSrc}
            fill
            alt={title}
            radius={'md'}
            priority={false}
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        <div className='leading-lg absolute start-0 end-0 bottom-0 rounded-b bg-black/35 p-3 text-lg font-semibold text-white'>
          {title}
        </div>
      </Link>
    </div>
  )
}

export { LandingSliderItem }
