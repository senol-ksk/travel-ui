import { Container, Image } from '@mantine/core'

import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXFill,
  RiYoutubeFill,
} from 'react-icons/ri'
import NextImage from 'next/image'

import { Link } from 'next-view-transitions'
import { link } from 'fs'
import { Route } from 'next'

const Footer = async () => {
  const widgetCollection = await getWidgetsByCollectionSlug()
  const widgetCollectionData = widgetCollection?.data
  const footerWidget = widgetCollectionData?.filter(
    (item) => item.point === 'footer'
  )

  return (
    <footer className='flex flex-col gap-5 bg-blue-900 pt-5 text-white'>
      <div>
        <Container className='flex flex-col gap-5 md:flex-row md:justify-between'>
          <div className='flex items-center justify-center gap-4 text-2xl text-blue-900'>
            <Link
              href='https://www.facebook.com/paraflytravel'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiFacebookFill />
            </Link>
            <Link
              href='https://www.instagram.com/paraflytravelcom'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiTwitterXFill />
            </Link>
            <Link
              href='https://x.com/paraflytravel'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiInstagramLine />
            </Link>
            <Link
              href='https://www.youtube.com/@paraf'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiYoutubeFill />
            </Link>
            {/* <Link
              href='https://www.whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiTiktokFill />
            </Link> */}
            <Link
              href='https://www.whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
              className='flex items-center gap-2'
            >
              <div className='relative size-[32px]'>
                <Image
                  component={NextImage}
                  src={'/whatsapp-icon.png'}
                  fill
                  alt='whatsapp'
                />
              </div>
              <div className='leading-sm text-xs text-white'>
                Whatsapp <br /> Kanal
              </div>
            </Link>
          </div>
          <div className='flex justify-center'>
            <div>
              <div className='flex items-center gap-3'>
                <div className='text-[32px] leading-none md:text-[65px]'>
                  <EarphoneIcon />
                </div>
                <div>
                  <div className='text-xl font-bold text-orange-800 md:text-3xl md:text-white'>
                    <a href='tel:08508781484'>0850 878 1484</a>
                  </div>
                  <div className='hidden ps-2 text-xs md:block'>
                    09:00-18:00 arasında arayabilirsiniz.
                  </div>
                </div>
              </div>
              <div className='ps-2 text-xs md:hidden'>
                09:00-18:00 arasında arayabilirsiniz.
              </div>
            </div>
          </div>
        </Container>
      </div>

      {footerWidget?.map((widget) => (
        <div key={widget.id} className='border-t border-b py-5 text-center'>
          <Container className='grid gap-4 md:flex md:gap-8'>
            {widget.params.footer_menu.menus.map((menu) => (
              <div key={menu.id}>
                <Link className='hover:underline' href={`${menu.url}` as Route}>
                  {menu.title}
                </Link>
              </div>
            ))}
          </Container>
        </div>
      ))}
      <div className='block md:hidden'>
        <Container className='justify-between gap-4 md:flex'>
          <div className='mb-4 flex w-full items-center justify-center gap-5 rounded-md bg-white p-4'>
            <div>
              <Image
                component={NextImage}
                src={'/logos/troy-logo.png'}
                width={52}
                w={52}
                height={24}
                alt='troy'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/visa-logo.png'}
                width={61}
                w={61}
                height={20}
                alt='visa'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/mastercard-logo.png'}
                width={39}
                w={39}
                height={24}
                alt='mastercard'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/amex-logo.png'}
                width={24}
                w={24}
                height={24}
                alt='amex'
              />
            </div>
          </div>
          <div className='flex w-full items-center justify-center gap-8 rounded-md bg-white p-4'>
            <div>
              <Image
                component={NextImage}
                src={'/logos/ykm-turizm-logo.png'}
                width={56}
                w={56}
                height={24}
                alt='YKM Turizm'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/iata-logo.png'}
                width={39}
                w={39}
                height={24}
                alt='iata'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/tursab-logo.png'}
                width={87}
                w={87}
                height={24}
                h={24}
                alt='tursab'
              />
            </div>
          </div>
        </Container>
      </div>
      <div className='hidden md:block'>
        <Container>
          <div className='py-5 text-sm leading-tight'>
            {footerWidget?.map((widget) => widget.params.description.value)}
          </div>
        </Container>
      </div>
      <div className='text-dark-700 hidden bg-white py-6 md:block'>
        <Container>
          <div className='flex justify-between'>
            <div className='text-sm'>
              Parafly Travel &copy; {new Date().getFullYear()} Her Hakkı
              Saklıdır.
            </div>
            <div className='flex'>
              <div className='flex items-center gap-5'>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/troy-logo.png'}
                    width={52}
                    w={52}
                    height={24}
                    alt='troy'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/visa-logo.png'}
                    width={61}
                    w={61}
                    height={20}
                    alt='visa'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/mastercard-logo.png'}
                    width={39}
                    w={39}
                    height={24}
                    alt='mastercard'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/amex-logo.png'}
                    width={24}
                    w={24}
                    height={24}
                    alt='amex'
                  />
                </div>

                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/ykm-turizm-logo.png'}
                    width={56}
                    w={56}
                    height={24}
                    alt='YKM Turizm'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/iata-logo.png'}
                    width={39}
                    w={39}
                    height={24}
                    alt='iata'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/tursab-logo.png'}
                    width={87}
                    w={87}
                    height={24}
                    h={24}
                    alt='tursab'
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className='text-dark-700 bg-white p-6 text-center text-xs md:hidden'>
        <div className='leading-tight'>
          {footerWidget?.map((widget) => widget.params.description.value)}
        </div>
        <div className='pt-6'>
          Parafly Travel &copy; {new Date().getFullYear()} Her Hakkı Saklıdır.
        </div>
      </div>
    </footer>
  )
}

export { Footer }

export const EarphoneIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    viewBox='0 0 32 32'
    fill='none'
  >
    <path d='M15.9999 31.7538C24.7006 31.7538 31.7538 24.7006 31.7538 15.9999C31.7538 7.29933 24.7006 0.246094 15.9999 0.246094C7.29933 0.246094 0.246094 7.29933 0.246094 15.9999C0.246094 24.7006 7.29933 31.7538 15.9999 31.7538Z' />
    <path
      d='M7.13842 21.2185H8.76303C9.30457 21.2185 9.74765 20.7754 9.74765 20.2339V16.3939V14.8677V13.4893C9.74765 10.0431 12.5538 7.23697 16 7.23697C19.4461 7.23697 22.2523 10.0431 22.2523 13.4893V14.8677V16.3939V19.9385C21.76 20.5785 20.0369 22.597 16.9846 22.9908V22.1539C16.9846 21.6124 16.5415 21.1693 16 21.1693C15.4584 21.1693 15.0153 21.6124 15.0153 22.1539V25.797C15.0153 26.3385 15.4584 26.7816 16 26.7816C16.5415 26.7816 16.9846 26.3385 16.9846 25.797V24.96C20.7261 24.6154 22.9415 22.2524 23.7292 21.2185H24.8615C26.4861 21.2185 27.8153 19.8893 27.8153 18.2647V16.7877C27.8153 15.1631 26.4861 13.8339 24.8615 13.8339H24.2215V13.44C24.2215 8.91081 20.5292 5.21851 16 5.21851C11.4707 5.21851 7.77842 8.91081 7.77842 13.44V13.8339H7.13842C5.5138 13.8339 4.18457 15.1631 4.18457 16.7877V18.2647C4.18457 19.8893 5.5138 21.2185 7.13842 21.2185ZM24.8615 15.8031C25.403 15.8031 25.8461 16.2462 25.8461 16.7877V18.2647C25.8461 18.8062 25.403 19.2493 24.8615 19.2493H24.2215V16.3939V15.8524H24.8615V15.8031ZM6.1538 16.7877C6.1538 16.2462 6.59688 15.8031 7.13842 15.8031H7.77842V16.3447V19.2H7.13842C6.59688 19.2 6.1538 18.757 6.1538 18.2154V16.7877Z'
      fill='white'
    />
  </svg>
)
