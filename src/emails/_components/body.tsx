import { em } from '@mantine/core'
import {
  Body,
  Html,
  pixelBasedPreset,
  Tailwind,
  Img,
  Container,
  Link,
} from '@react-email/components'

type IProps = {
  children: React.ReactNode
}

export const EmailBody: React.FC<IProps> = ({ children }) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            colors: {
              blue: { 800: '#1c7ed6' },
            },
          },
        }}
      >
        <Body className='m-0 font-sans leading-normal'>
          <div className='p-3'>
            <Link href='https://www.paraflytravel.com/'>
              <Img
                src={'https://paraflystatic.mncdn.com/7/Content/img/logo2x.png'}
                alt='ParaflyTravel'
                width={116}
                className='mx-auto'
              />
            </Link>
          </div>

          <Container
            style={{
              maxWidth: em(1200),
            }}
          >
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
