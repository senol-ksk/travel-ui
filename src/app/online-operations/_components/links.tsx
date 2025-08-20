'use client'

import { usePathname } from 'next/navigation'
import { UnstyledButton } from '@mantine/core'
import clsx from 'clsx'
import { Link } from 'next-view-transitions'
import { ReactNode } from 'react'
import { Route } from 'next'

const pageLinks = [
  { title: 'Seyahatinizi Görüntüleyin', pathname: '/online-operations' },
  { title: 'Online Check-in', pathname: '/online-operations/checkin' },
  // {
  //   title: 'Uçak Bileti İptal/İade',
  //   pathname: '/online-operations/cancel-flight',
  // },
]

export const OnlineOperationButtonLinks = () => {
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
  children: ReactNode
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
