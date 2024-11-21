'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { nprogress, NavigationProgress } from '@mantine/nprogress'

export function RouterTransition() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setTimeout(nprogress.complete, 500)

    return () => {
      nprogress.start()
    }
  }, [pathname, searchParams])

  return <NavigationProgress />
}
