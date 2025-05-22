import { Title } from '@mantine/core'

export const CheckoutCard: React.FC<{
  children: React.ReactNode
  title?: string | null
}> = ({ children, title }) => (
  <div className={`rounded-md border bg-white p-2 shadow-xs md:p-4`}>
    {title && (
      <Title order={3} fz={'lg'} mb={'md'}>
        {title}
      </Title>
    )}
    {children}
  </div>
)
