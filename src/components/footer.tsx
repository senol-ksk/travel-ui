import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import { Container } from '@mantine/core'
import { Link } from 'next-view-transitions'
import Image from 'next/image'

const Footer = async () => {
  const widgetCollection = await getWidgetsByCollectionSlug()
  const widgetCollectionData = widgetCollection?.data
  const footerWidget = widgetCollectionData?.filter(
    (item) => item.point === 'footer'
  )
  const socialMenus = widgetCollectionData?.filter(
    (item) => item.point === 'social_menu'
  )

  return (
    <footer className='bg-gray-50 px-3 py-5 md:py-7'>
      <Container className='grid gap-4 md:gap-8'>
        <div className='flex gap-3'>
          <div>
            <Link href='/'>
              <Image
                src='/logo.png'
                width={118}
                height={41}
                alt='Paraflytravel'
                priority
              />
            </Link>
          </div>
          {footerWidget?.map((widget) => (
            <div key={widget.id} className='hidden'>
              <div
                dangerouslySetInnerHTML={{
                  __html: widget.params.customer_service.value,
                }}
              />
            </div>
          ))}
          <div className='ms-auto flex gap-3'>
            {socialMenus?.map((widget) => {
              return (
                <div key={widget.id}>
                  <a
                    href={widget.params.link.value}
                    target='_blank'
                    dangerouslySetInnerHTML={{
                      __html: widget.params.svg.value,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
        {footerWidget?.map((widget) => (
          <div
            key={widget.id}
            className='grid gap-2 border-t border-b py-2 md:flex md:gap-5'
          >
            {widget.params.footer_menu.menus.map((menu) => (
              <div key={menu.id}>
                <a className='hover:text-blue-600' href={menu.url}>
                  {menu.title}
                </a>
              </div>
            ))}
          </div>
        ))}
        <div className='text-sm leading-tight'>
          {footerWidget?.map((widget) => widget.params.description.value)}
        </div>
      </Container>
      <div className='py-6 text-center text-sm'>
        &copy; 2017 - {new Date().getFullYear()} Tüm hakları saklıdır.
        paraflytravel.com
      </div>
    </footer>
  )
}

export { Footer }
