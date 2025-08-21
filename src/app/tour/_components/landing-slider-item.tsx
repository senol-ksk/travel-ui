import { AspectRatio, Box, Image } from '@mantine/core'
import { Route } from 'next'
import { Link } from 'next-view-transitions'
import NextImage from 'next/image'

type IProps = {
  href: Route
  imageSrc: string
  title: string
}

const LandingSliderItem: React.FC<IProps> = ({ href, imageSrc, title }) => {
  return (
    <div className='group relative rounded'>
      <Box component={Link} display={'block'} href={href} w={200}>
        <AspectRatio className='relative z-0'>
          <Image
            component={NextImage}
            src={imageSrc}
            alt={title}
            width={200}
            height={200}
            radius={'md'}
            priority={false}
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='brightness-50 transition-all group-hover:brightness-75'
          />
        </AspectRatio>

        <div className='leading-lg absolute start-0 end-0 bottom-0 z-20 p-3 text-lg font-semibold text-white'>
          {title}
        </div>
      </Box>
    </div>
  )
}

export { LandingSliderItem }
