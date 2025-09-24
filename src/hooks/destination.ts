import { ModuleNames } from '@/app/account/reservations/types'
import { LocationResult } from '@/components/search-engine/locations/type'
import { request } from '@/network'
import { useQueries } from '@tanstack/react-query'

export const useDestinationGetBySlug = ({
  slugs,
  moduleName,
}: {
  slugs: string[]
  moduleName: ModuleNames
}) =>
  useQueries({
    queries: slugs.filter(Boolean).map((slug) => ({
      queryKey: ['destination-slug', slug, moduleName],
      queryFn: async () => {
        const response = (await request({
          url: `${process.env.NEXT_PUBLIC_API_DESTINATION_ROUTE}/v1.1/api/${moduleName.toLowerCase()}/getbyslug`,
          params: {
            slug,
          },
        })) as { Result: LocationResult }

        return response
      },
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  })
