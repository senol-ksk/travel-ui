import { useQuery } from '@tanstack/react-query'

import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'

type Widgets = {
  id: ID
  title: string
  typeId: ID
  collectionId: ID
  point: string
  params: {
    sort_description: {
      value: string
    }
    description: {
      value: string
    }
    image: {
      value: string
    }
    location: {
      value: string
    }
    comment: {
      value: string
    }
    comment_no: {
      value: string
    }
    price: {
      value: string
    }
    discount_price: {
      value: string
    }
    btn_text: {
      value: string
    }
    link: {
      value: string
    }
    tag: {
      value: string
    }
    time: {
      value: string
    }
  }
  ordering: number
  language: string
  active: boolean
}[]

type Params = {
  teaser: {
    value: string
  }
  landing_menu: {
    menus: {
      id: ID
      poolId: ID
      parentId: null
      language: string
      title: string
      url: string
      urlTarget: null
      comment: null
      icon: null
      image: null
      fileId: null
      active: boolean
      ordering: number
      createdBy: string
      createdDate: string
      updatedBy: null
      updatedDate: null
      items: {
        id: ID
        poolId: ID
        parentId: null
        language: string
        title: string
        url: string
        urlTarget: null
        comment: null
        icon: null
        image: null
        fileId: null
        active: boolean
        ordering: number
        createdBy: string
        createdDate: string
        updatedBy: null
        updatedDate: null
        items: []
      }[]
    }[]
    value: string
  }
}

export const useCmsQuery = (slug: string) => {
  const cmsQuery = useQuery({
    queryKey: ['story-slider', slug],
    queryFn: async () => {
      const response = await getContent<CmsContent<Widgets, Params>>(slug)

      return response?.data
    },
  })

  return { cmsQuery }
}
