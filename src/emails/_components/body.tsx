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
  Section,
  Text,
  Row,
  Column,
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
                minWidth: em(800),
              }}
              className='p-4'
            >
              <Section>
                <Row>
                  <Column>{children}</Column>
                </Row>
              </Section>
              <Section className='text-center text-xs'>
                <Text className='mx-auto w-3/4'>
                  Paraflytravel.com sitesinin tüm seyahat hizmetleri Yeni
                  Karamürsel Turizm ve Seyahat Acentası tarafından haftanın her
                  günü 09:00 - 18:00 saatleri arasında verilmektedir.
                </Text>
                <Section width={'55%'}>
                  <div>
                    <strong>Karya Tur Seyahat Acenteliği A.Ş</strong>
                  </div>
                  <div>
                    İcadiye, Cumhuriyet Cad. No:167/5, 34674 Üsküdar / İstanbul 
                  </div>
                  <div>Mersis No: 0948006409700018 </div>
                </Section>
              </Section>
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  )
}
