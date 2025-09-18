'use client'

import { usePathname } from 'next/navigation'
import { UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { Link } from 'next-view-transitions'
import { Route } from 'next'

const pageLinks = [
  { title: 'ParafPara Sorgula', pathname: '/parafly/bonus-query' },
  { title: 'ParafPara Hesapla', pathname: '/parafly/calculate' },
  {
    title: 'Parafly Travel Nedir?',
    pathname: '/parafly/about',
  },
]

export const ParafNavigationLinks = () => {
  const pathname = usePathname()
  return pageLinks.map((pageLink, pageLinkIndex) => (
    <PageLinkButton
      key={pageLinkIndex}
      link={pageLink.pathname as Route}
      isActive={pageLink.pathname === pathname}
    >
      {pageLink.title}
    </PageLinkButton>
  ))
}

type PageLinkProps = {
  children: React.ReactNode
  link: Route
  isActive?: boolean
}
const PageLinkButton: React.FC<PageLinkProps> = ({
  children,
  isActive = false,
  link,
}) => {
  return (
    <UnstyledButton
      component={Link}
      href={link}
      className={clsx(
        'block rounded-md border border-white px-5 py-2 text-center',
        {
          'bg-white text-blue-800': isActive,
          'bg-blue-800 text-white': !isActive,
        }
      )}
    >
      {children}
    </UnstyledButton>
  )
}
