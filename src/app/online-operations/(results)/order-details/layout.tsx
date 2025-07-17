import { Container } from '@mantine/core'

export default function BookDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container
      maw={700}
      py={{
        base: 'md',
        md: 'xl',
      }}
      px={0}
    >
      {children}
    </Container>
  )
}
