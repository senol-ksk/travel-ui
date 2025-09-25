import { Suspense } from 'react'
import { CyprusSearchResults } from './client'
import { Skeleton } from '@mantine/core'

export default function CyprusSearchResultsPage() {
  return (
    <Suspense fallback={<Skeleton h={12} />}>
      <CyprusSearchResults />
    </Suspense>
  )
}
