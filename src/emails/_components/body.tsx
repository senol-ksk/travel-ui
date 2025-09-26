import { DEFAULT_THEME, em } from '@mantine/core'
import {
  Body,
  Column,
  Container,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

dayjs.locale('tr')

type IProps = {
  children: React.ReactNode
  previewText?: string
}

export const EmailBody: React.FC<IProps> = ({ children, previewText }) => {
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

              gray: { DEFAULT: '#DEE2E6' },
              green: {
                DEFAULT: DEFAULT_THEME.colors.green[0],
                100: DEFAULT_THEME.colors.green[1],
                200: DEFAULT_THEME.colors.green[2],
                300: DEFAULT_THEME.colors.green[3],
                400: DEFAULT_THEME.colors.green[4],
                500: DEFAULT_THEME.colors.green[5],
                600: DEFAULT_THEME.colors.green[6],
                700: DEFAULT_THEME.colors.green[7],
                800: DEFAULT_THEME.colors.green[8],
                900: DEFAULT_THEME.colors.green[9],
              },
              red: {
                DEFAULT: DEFAULT_THEME.colors.red[0],
                100: DEFAULT_THEME.colors.red[1],
                200: DEFAULT_THEME.colors.red[2],
                300: DEFAULT_THEME.colors.red[3],
                400: DEFAULT_THEME.colors.red[4],
                500: DEFAULT_THEME.colors.red[5],
                600: DEFAULT_THEME.colors.red[6],
                700: DEFAULT_THEME.colors.red[7],
                800: DEFAULT_THEME.colors.red[8],
                900: DEFAULT_THEME.colors.red[9],
              },
              blue: {
                DEFAULT: DEFAULT_THEME.colors.blue[0],
                100: DEFAULT_THEME.colors.blue[1],
                200: DEFAULT_THEME.colors.blue[2],
                300: DEFAULT_THEME.colors.blue[3],
                400: DEFAULT_THEME.colors.blue[4],
                500: DEFAULT_THEME.colors.blue[5],
                600: DEFAULT_THEME.colors.blue[6],
                700: DEFAULT_THEME.colors.blue[7],
                800: DEFAULT_THEME.colors.blue[8],
                900: DEFAULT_THEME.colors.blue[9],
              },
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
        <Body className='m-0 gap-5 bg-white font-sans leading-normal text-black'>
          {previewText && <Preview>{previewText}</Preview>}
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
              className='gap-5 p-4'
            >
              <Section className='mb-3 rounded-lg bg-blue-700 p-2'>
                <Row>
                  <Column align='center'>
                    <table>
                      <tr>
                        <td className='px-[18px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/ucak`}
                          >
                            Uçak
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/otel`}
                          >
                            Otel
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/arac`}
                          >
                            Araç
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/tur`}
                          >
                            Tur
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/otobus`}
                          >
                            Otobüs
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/transfer`}
                          >
                            Transfer
                          </Link>
                        </td>
                      </tr>
                    </table>
                  </Column>
                </Row>
              </Section>
              <Section>
                <Row>
                  <Column>{children} </Column>
                </Row>
              </Section>
              <Row className='pt-3'>
                <Column align='center'>
                  <Link
                    href='https://whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
                    className='inline-block rounded-lg border border-solid border-green-800 p-2 text-black no-underline'
                  >
                    <Row>
                      <Column>
                        <Img src='https://ykmturizm.mncdn.com/11/Files/email/img/whatsp.png' />
                      </Column>
                      <Column className='pl-2'>
                        Whatsapp kanalımızı takip edin
                      </Column>
                    </Row>
                  </Link>
                </Column>
              </Row>
              <Section className='text-center text-xs'>
                <Text className='mx-auto w-3/4'>
                  Paraflytravel.com sitesinin tüm seyahat hizmetleri Yeni
                  Karamürsel Turizm ve Seyahat Acentası tarafından
                  verilmektedir.
                </Text>
                <Section width={'55%'}>
                  <div>
                    <strong>Yeni Karamürsel Turizm ve Seyahat Acentası</strong>
                  </div>
                  <div>
                    İcadiye, Cumhuriyet Cad. No:167/5, 34674 Üsküdar / İstanbul
                  </div>
                  <div> Mersis No: 0948006409700018 </div>
                </Section>
              </Section>
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  )
}
