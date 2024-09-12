import 'dayjs/locale/tr'
import { DatesProvider } from '@mantine/dates'

type Props = {
  children: React.ReactNode
}

export const Provider: React.FC<Props> = ({ children }) => (
  <DatesProvider settings={{ locale: 'tr', timezone: 'GMT' }}>
    {children}
  </DatesProvider>
)
