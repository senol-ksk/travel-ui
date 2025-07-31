export interface CmsContent<Widgets, Params> {
  active: boolean
  category: null
  categoryId: null
  contentType: string
  defaultLayout: null
  defaultSchema: null
  description: null
  fileUrl: null
  id: ID
  imageUrl: null
  language: string
  layout: null
  metaDescription: null
  metaKeyword: null
  metaTitle: null
  ordering: null
  params: Params
  publicationDate: null
  publicationEndDate: null
  redirect: string
  schema: null
  slug: string
  title: string
  widgetCollectionId: number
  widgets: Widgets
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
      value: string
    }
    link: {
      value: string
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
    destinations: {
      destinations: {
        id: ID
        name: string
        slug: string
        code: null
        iata: null
        typeId: number
        domestic: boolean
      }[]
    }
    sort_desc: {
      value: string
    }
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
    description: { value: string | null } | null
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

export type Widgets = {
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
      value: string
    } | null
  }
  ordering: number
  language: string
  active: boolean
}[]

export type Params = {
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

export interface TourDealType {
  id: ID
  imagePath: string
  title: string
  subTitle: string
  priceWithCurrency: ServicePriceType
  discountedPriceWithCurrency: ServicePriceType
  price: number
  productKey: string
  sessionToken: null
  searchToken: null
  promotionText: string
  startDate: string
  endDate: string
  providerName: string
  subDealId: ID
}
