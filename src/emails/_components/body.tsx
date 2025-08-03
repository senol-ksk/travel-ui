import { em } from '@mantine/core'
import {
  Body,
  Html,
  pixelBasedPreset,
  Tailwind,
  Img,
  Container,
  Link,
  Head,
} from '@react-email/components'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

type IProps = {
  children: React.ReactNode
}

export const EmailBody: React.FC<IProps> = ({ children }) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          darkMode: 'selector',
          theme: {
            colors: {
              black: '#000',
              white: '#fff',
              blue: { DEFAULT: '#1c7ed6' },
              gray: { DEFAULT: '#DEE2E6' },
            },
            borderRadius: {
              none: '0',
              sm: '.125rem',
              DEFAULT: '.25rem',
              lg: '.5rem',
              full: '9999px',
            },
          },
        }}
      >
        <Body className='m-0 bg-white font-sans leading-normal text-black'>
          {/*
          https://developers.google.com/workspace/gmail/markup/reference/flight-reservation#use_cases
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: `{
  "@context": "http://schema.org",
  "@type": "FlightReservation",
  "reservationFor": {
    "@type": "Flight",
    "airline": {
      "@type": "Airline",
      "name": "Pegasus Havayolları"
    },
    "departureAirport": {
      "@type": "Airport",
      "iataCode": "SAW"
    },
    "departureTime": "2025-10-13T17:20",
    "arrivalAirport": {
      "@type": "Airport",
      "name": "Schiphol Havalimanı",
      "iataCode": "AMS"
    },
    "arrivalTime": "2025-10-14T08:55"
  }
}`,
            }}
          /> */}
          <div className='bg-white'>
            <div className='p-3'>
              <Link href='https://www.paraflytravel.com/'>
                <Img
                  src={
                    'https://paraflystatic.mncdn.com/7/Content/img/logo2x.png'
                  }
                  alt='ParaflyTravel'
                  width={116}
                  className='mx-auto'
                />
              </Link>
            </div>

            <Container
              style={{
                maxWidth: em(800),
              }}
              className='p-4'
            >
              {children}
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  )
}
