import { serviceRequest } from '@/network'

type ContentDetail = {
  id: ID
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: null
  params: {
    sub_title: {
      value: string
    }
    sort_description: {
      value: string
    }
    description_title: {
      value: ''
    }
    description: {
      value: string
    }
    terms_Of_conditions_title: {
      value: string
    }
    terms_Of_conditions: {
      value: string
    }
    promation: {
      value: ''
    }
    promation_code: {
      value: ''
    }
    btn_name: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    view_country_code: {
      value: ''
    }
  }
  title: string
  description: null
  categoryId: ID
  widgetCollectionId: ID
  publicationDate: null
  publicationEndDate: null
  metaTitle: null
  metaDescription: null
  metaKeyword: null
  layout: null
  schema: null
  ordering: number
  active: true
  imageUrl: null
  fileUrl: null
}

type CMSMasterWidgetParams = {
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
    btn_text: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    svg: {
      value: string
    }
    view_country: {
      value: string
    }
    customer_service: {
      value: string
    }
    footer_menu: {
      menus: { id: ID; url: string; title: string }[]
    }
    main_menu: {
      menus: { id: ID; url: string; title: string }[]
    }
  }
  ordering: number
  language: string
  active: boolean
}[]

type CampaingCategories = {
  id: ID
  parentId: null
  idMap: null
  language: string
  title: string
  description: null
  slug: string
  redirectUrl: null
  items: null
}

type CategoryContent = {
  id: 813
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: null
  params: {
    sub_title: {
      value: string
    }
    sort_description: {
      value: string
    }
    description_title: {
      value: string
    }
    description: {
      value: string
    }
    terms_Of_conditions_title: {
      value: ''
    }
    terms_Of_conditions: {
      value: string
    }
    promation: {
      value: string
    }
    promation_code: {
      value: string
    }
    btn_name: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    view_country_code: {
      value: ''
    }
  }
  title: string
  description: null
  categoryId: ID
  widgetCollectionId: ID
  publicationDate: null
  publicationEndDate: null
  metaTitle: null
  metaDescription: null
  metaKeyword: null
  layout: null
  schema: null
  ordering: number
  active: boolean
  imageUrl: null
  fileUrl: null
}

export function getContent<ContentType>(slug: string) {
  return serviceRequest<ContentType>({
    axiosOptions: {
      url: 'api/cms/content',
      params: { slug },
    },
  })
}

export function getWidgetsByCollectionSlug() {
  return serviceRequest<CMSMasterWidgetParams>({
    axiosOptions: {
      url: 'api/cms/getWidgetsByCollectionSlug',
    },
  })
}

export function getCategoriesByParent(slug = 'kampanyalar') {
  return serviceRequest<CampaingCategories[]>({
    axiosOptions: {
      url: 'api/cms/getCategoriesByParent',
      params: { slug },
    },
  })
}

export function getContentsByCategorySlug(categorySlug = 'kampanyalar') {
  return serviceRequest<CategoryContent[]>({
    axiosOptions: {
      url: 'api/cms/getContentsByCategorySlug',
      params: { categorySlug },
    },
  })
}

export function getContentBySlugAsync(slug: string) {
  return serviceRequest<ContentDetail>({
    axiosOptions: {
      url: 'api/cms/getContentBySlugAsync',
      params: { slug },
    },
  })
}

export function cdnImageUrl(src: string) {
  if (typeof window === null) return `${process.env.CMS_CDN}/${src}`

  return `${process.env.NEXT_PUBLIC_CMS_CDN}/${src}`.replace(
    /([^:]\/)\/+/g,
    '$1'
  )
}
export function cdnSiteImageUrl(src: string) {
  if (typeof window === null)
    return `${process.env.CMS_SITE_CDN}/${src}`.replace(/([^:]\/)\/+/g, '$1')

  return `${process.env.NEXT_PUBLIC_CMS_SITE_CDN}/${src}`.replace(
    /([^:]\/)\/+/g,
    '$1'
  )
}
