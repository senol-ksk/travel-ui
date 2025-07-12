import { Container } from '@mantine/core'

import dayjs from 'dayjs'
import dayjsLocale from 'dayjs/locale/tr'
dayjs.locale(dayjsLocale)

export const HotelBookingSummary = () => {
  return (
    <Container
      maw={700}
      py={{
        base: 'md',
        md: 'xl',
      }}
      className='grid gap-3 md:gap-5'
    >
      tur
    </Container>
  )
}
