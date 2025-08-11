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
import { Svg } from './svg'
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
              <a
                href='https://whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
                className='text-black no-underline'
              >
                <div
                  className='mt-3'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <div
                    className='p-2 text-center text-xs'
                    style={{
                      border: '2px solid #0DC143',
                      borderRadius: '13px',
                      padding: '5px',
                      width: '30%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <Svg>
                      <path
                        d='M2.25391 30.693L4.33152 23.1168C3.04794 20.9019 2.37331 18.3825 2.37331 15.8094C2.37928 7.7437 8.94047 1.18848 17.0002 1.18848C20.9106 1.18848 24.5882 2.71086 27.3464 5.47504C30.1106 8.23922 31.633 11.9109 31.627 15.8213C31.6211 23.881 25.0599 30.4422 17.0002 30.4422H16.9942C14.5464 30.4422 12.1405 29.8273 10.0032 28.6631L2.25391 30.693Z'
                        fill='#0DC143'
                      />
                      <g filter='url(#filter0_d_1831_76)'>
                        <path
                          d='M1.72266 31.2234L3.87191 23.3727C2.54654 21.0801 1.854 18.4712 1.854 15.8025C1.854 7.45028 8.654 0.65625 17.0062 0.65625C21.06 0.65625 24.863 2.23834 27.7227 5.09804C30.5824 7.96371 32.1585 11.7667 32.1585 15.8145C32.1525 24.1667 25.3585 30.9607 17.0062 30.9607H17.0003C14.463 30.9607 11.9734 30.3219 9.75848 29.1159L1.72266 31.2234ZM10.1286 26.3757L10.5883 26.6503C12.5227 27.7965 14.7376 28.4055 17.0003 28.4055H17.0062C23.9495 28.4055 29.5973 22.7577 29.5973 15.8145C29.5973 12.4533 28.2898 9.28909 25.9137 6.907C23.5376 4.52491 20.3734 3.21744 17.0122 3.21744C10.063 3.21744 4.41519 8.8652 4.41519 15.8085C4.41519 18.1846 5.07788 20.501 6.33758 22.507L6.63609 22.9846L5.36445 27.6294L10.1286 26.3757Z'
                          fill='url(#paint0_linear_1831_76)'
                        />
                      </g>
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M13.2155 9.46887C12.9289 8.83603 12.6304 8.82409 12.3618 8.81215C12.1409 8.80021 11.8901 8.80618 11.6334 8.80618C11.3827 8.80618 10.9707 8.9017 10.6244 9.27782C10.2782 9.65394 9.29907 10.5733 9.29907 12.436C9.29907 14.2987 10.6543 16.1017 10.8453 16.3524C11.0364 16.6032 13.4662 20.5495 17.311 22.0659C20.511 23.3256 21.1618 23.0748 21.8543 23.0151C22.5468 22.9554 24.0931 22.1017 24.4095 21.2181C24.7259 20.3345 24.7259 19.5763 24.6304 19.4211C24.5349 19.2659 24.2841 19.1704 23.9021 18.9793C23.5259 18.7883 21.6632 17.8748 21.317 17.7495C20.9707 17.6241 20.72 17.5584 20.4633 17.9405C20.2125 18.3166 19.4841 19.1704 19.2633 19.4211C19.0424 19.6719 18.8215 19.7077 18.4453 19.5166C18.0692 19.3256 16.8453 18.9256 15.4006 17.636C14.2722 16.633 13.514 15.3913 13.2931 15.0151C13.0722 14.639 13.2692 14.4301 13.4603 14.245C13.6274 14.0778 13.8364 13.8032 14.0274 13.5823C14.2185 13.3614 14.2782 13.2062 14.4035 12.9495C14.5289 12.6987 14.4692 12.4778 14.3737 12.2868C14.2901 12.0898 13.5558 10.2211 13.2155 9.46887Z'
                        fill='white'
                      />
                      <defs>
                        <filter
                          id='filter0_d_1831_76'
                          x='0.722656'
                          y='0.65625'
                          width='32.4358'
                          height='32.5671'
                          filterUnits='userSpaceOnUse'
                          color-interpolation-filters='sRGB'
                        >
                          <feFlood
                            flood-opacity='0'
                            result='BackgroundImageFix'
                          />
                          <feColorMatrix
                            in='SourceAlpha'
                            type='matrix'
                            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                            result='hardAlpha'
                          />
                          <feOffset dy='1' />
                          <feGaussianBlur stdDeviation='0.5' />
                          <feComposite in2='hardAlpha' operator='out' />
                          <feColorMatrix
                            type='matrix'
                            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0'
                          />
                          <feBlend
                            mode='normal'
                            in2='BackgroundImageFix'
                            result='effect1_dropShadow_1831_76'
                          />
                          <feBlend
                            mode='normal'
                            in='SourceGraphic'
                            in2='effect1_dropShadow_1831_76'
                            result='shape'
                          />
                        </filter>
                        <linearGradient
                          id='paint0_linear_1831_76'
                          x1='16.9406'
                          y1='31.2234'
                          x2='16.9406'
                          y2='0.65625'
                          gradientUnits='userSpaceOnUse'
                        >
                          <stop stop-color='#F9F9F9' />
                          <stop offset='1' stop-color='white' />
                        </linearGradient>
                      </defs>
                    </Svg>{' '}
                    Whatsapp kanalımızı takip edin
                  </div>
                </div>
              </a>
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
