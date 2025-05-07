import dayjs from 'dayjs'
import { DatesProvider } from '@mantine/dates'

type Props = {
  children: React.ReactNode
}

import 'dayjs/locale/tr'
dayjs.locale('tr')

export const Provider: React.FC<Props> = ({ children }) => (
  <DatesProvider settings={{ locale: 'tr' }}>{children}</DatesProvider>
)
