import { Link } from 'next-view-transitions'
import { Box } from '@mantine/core'
import { cdnImageUrl } from '@/libs/cms-data'
import { Route } from 'next'

type ProductBoxProps = {
  image: string
  title: string
  description?: string
  url: Route
}

export default function ProductBox({
  url,
  image,
  title,
  description,
}: ProductBoxProps) {
  return (
    <Box
      component={Link}
      href={url}
      className='group relative flex h-[200px] flex-col justify-end overflow-hidden rounded-lg border bg-white p-3 text-white'
      style={{ backgroundImage: `url(${cdnImageUrl(image)})` }}
      bgsz={'cover'}
      bgp={'center'}
    >
      <div
        className='absolute top-0 right-0 bottom-0 left-0 -z-0 block bg-black/20 transition-all group-hover:bg-black/35'
        aria-hidden
      />
      <div className='relative z-10'>
        <div className='text-lg font-bold'>{title}</div>
        <div>{description}</div>
      </div>
    </Box>
  )
}
