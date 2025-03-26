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

export type FlightLandingWidget = {
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
      value: ''
    }
    link: {
      value: ''
    }

    view_country: {
      value: string
    }
    destinations: {
      destinations: {
        id: ID
        name: string
        slug: string
        code: string | null
        iata: null
        typeId: ID
        domestic: boolean
      }[]
      value: ''
    }
    image: {
      value: string
    }
    sort_desc: {
      value: string
    }
    icon: {
      value: ''
    }
    search_date: {
      value: ''
    }
    svg: {
      value: string
    }
  }
  ordering: null | number
  language: string
  active: boolean
}

export type FlightLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

export type HotelLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}
export type HotelLandingWidgets = {
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
  }
  ordering: null
  language: string
  active: boolean
}

export type CarLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

export type CarLandingWidget = {
  id: ID
  title: string
  typeId: ID
  collectionId: null
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
    images: {
      list: string[]
      value: null
    }
  }
  ordering: ID
  language: string
  active: boolean
}

export type BusLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

export type BusLandingWidgets = {
  id: ID
  title: string
  typeId: ID
  collectionId: null
  point: string
  params: {
    destinations: {
      destinations: {
        id: ID
        name: string
        slug: string
        code: string
        iata: null
        typeId: number
        domestic: boolean
      }[]
      value: string
    }
    image: {
      value: string
    }
    sort_desc: {
      value: string
    }
    icon: {
      value: string
    }
    search_date: {
      value: string
    }
    svg: {
      value: string
    }
  }
  ordering: number
  language: string
  active: boolean
}

export type TransferLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

export type TransferLandingWidget = {
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
  }
  ordering: number
  language: string
  active: boolean
}

export type TourLandingWidget = {
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
  }
  ordering: number
  language: string
  active: boolean
}

export type TourLandingParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}
