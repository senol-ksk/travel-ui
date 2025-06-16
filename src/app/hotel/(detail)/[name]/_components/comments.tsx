import { HotelCommentInfo } from '@/app/hotel/types'
import { Carousel } from '@mantine/carousel'
import { Card, Badge, Text, Group, Divider } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  data: HotelCommentInfo
}

const Comments: React.FC<IProps> = ({ data }) => {
  const { comments } = data
  return (
    <div className=''>
      <Carousel
        withIndicators
        slideSize='30%'
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

              <div className='h-[150px] overflow-hidden pt-2 text-sm'>
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
