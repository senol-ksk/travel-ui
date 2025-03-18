export interface CmsContent {
  id: ID
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: {
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
  params: {
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
  title: string
  description: null
  categoryId: null
  widgetCollectionId: number
  publicationDate: null
  publicationEndDate: null
  metaTitle: null
  metaDescription: null
  metaKeyword: null
  layout: null
  schema: null
  ordering: null
  active: boolean
  imageUrl: null
  fileUrl: null
}
