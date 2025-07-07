import { HotelCommentInfo } from '@/app/hotel/types'
import { Carousel } from '@mantine/carousel'
import { Card, Badge, Text, Group, Divider } from '@mantine/core'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

type IProps = {
  data: HotelCommentInfo
}

const Comments: React.FC<IProps> = ({ data }) => {
  const { comments } = data
  const [slideSize, setSlideSize] = useState('100%')

  useEffect(() => {
    const handleResize = () => {
      setSlideSize(window.innerWidth >= 768 ? '30%' : '100%')
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
      <Carousel
        withIndicators
        slideSize={slideSize}
        slideGap='md'
        emblaOptions={{ align: 'start' }}
      >
        {comments.map((comment, index) => (
          <Carousel.Slide key={index}>
            <Card
              className='bg-blue-50 text-sm'
              padding='lg'
              shadow='sm'
              radius='md'
            >
              <Group mb='xs'>
                <Text size='sm'>Çok iyi</Text>
                <Badge color='green' size='lg' radius='md'>
                  {comment.averageScore}
                </Badge>
              </Group>
              <Text size='sm'>
                {comment.withWhoLabel} {comment.reasonLabel}
              </Text>

              <div className='pt-2 text-sm'>
                <Text lineClamp={6} fz={'sm'}>
                  {comment.positiveCotent}
                </Text>
              </div>
              <Divider my={'sm'} />
              <div>
                {comment.name} {comment.surname}
              </div>
              <div>{dayjs(comment.commentDate).format('MMMM YYYY')}</div>
            </Card>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  )
}

export { Comments }
