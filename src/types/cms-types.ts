export interface CmsContent<Widgets, Params> {
  id: ID
  contentType: string
  defaultLayout: null
  defaultSchema: null
  slug: string
  language: string
  redirect: string
  category: null
  widgets: Widgets
  params: Params
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
