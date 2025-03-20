import { useQuery } from '@tanstack/react-query'

import { serviceRequest } from '@/network'
import { CmsContent } from '@/types/cms-types'

export const useCmsQuery = (slug: string) => {
  const cmsQuery = useQuery({
    queryKey: ['story-slider', slug],
    queryFn: async () => {
      const response = await serviceRequest<CmsContent>({
        axiosOptions: {
          url: 'api/cms/content',
          params: { slug },
        },
      })

      return response?.data
    },
  })

  return { cmsQuery }
}
