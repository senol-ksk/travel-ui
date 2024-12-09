import { SearchParams } from 'nuqs'

import { carSearchParamsCahce } from '@/modules/carrent/searchParams'
import { serviceRequest } from '@/network'

export const getCarSearchResultParams = async (
  searchParams: SearchParams
): Promise<CarSearchRequest | null | undefined> => {
  const params = carSearchParamsCahce.parse(searchParams)

  const response = await serviceRequest<CarSearchRequest>({
    axiosOptions: {
      url: 'api/car/searchResults',
      params,
    },
  })
  console.log(response?.data)
  return response?.data

  return carDummyData
}

export const carDummyData: CarSearchRequest = {
  params: {
    carRentalSearchPanel: {
      origin: [
        {
          id: 304263,
          code: '508',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'WindyCar',
        },
        {
          id: 304263,
          code: '1435',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'OtoCar',
        },
        {
          id: 304263,
          code: '615',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'Europcar',
        },
        {
          id: 304263,
          code: 'sabiha-gokcen-havalimani-arac-kiralama',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'YesOtoEnterprise',
        },
        {
          id: 304263,
          code: '33:iSG52',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'SixtTurkey',
        },
        {
          id: 304263,
          code: 'istanbul-sabiha-gokcen-havalimani-saw',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'RentiCar',
        },
        {
          id: 304263,
          code: '0518a7e3-c582-ee11-8179-6045bd8d158b',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'RentGo',
        },
        {
          id: 304263,
          code: '12',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'MobilUp',
        },
        {
          id: 304263,
          code: '99',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'EasyGo',
        },
        {
          id: 304263,
          code: '11',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'HdyFilo',
        },
        {
          id: 304263,
          code: '265',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'KolayCar',
        },
        {
          id: 304263,
          code: '509',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'DmrCar',
        },
        {
          id: 304263,
          code: '265',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'KarRent',
        },
        {
          id: 304263,
          code: '1123',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'DailyDrive',
        },
        {
          id: 304263,
          code: '2',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'Ekar',
        },
      ],
      destination: [
        {
          id: 304263,
          code: '508',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'WindyCar',
        },
        {
          id: 304263,
          code: '1435',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'OtoCar',
        },
        {
          id: 304263,
          code: '615',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'Europcar',
        },
        {
          id: 304263,
          code: 'sabiha-gokcen-havalimani-arac-kiralama',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'YesOtoEnterprise',
        },
        {
          id: 304263,
          code: '33:iSG52',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'SixtTurkey',
        },
        {
          id: 304263,
          code: 'istanbul-sabiha-gokcen-havalimani-saw',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'RentiCar',
        },
        {
          id: 304263,
          code: '0518a7e3-c582-ee11-8179-6045bd8d158b',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'RentGo',
        },
        {
          id: 304263,
          code: '12',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'MobilUp',
        },
        {
          id: 304263,
          code: '99',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'EasyGo',
        },
        {
          id: 304263,
          code: '11',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'HdyFilo',
        },
        {
          id: 304263,
          code: '265',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'KolayCar',
        },
        {
          id: 304263,
          code: '509',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'DmrCar',
        },
        {
          id: 304263,
          code: '265',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'KarRent',
        },
        {
          id: 304263,
          code: '1123',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'DailyDrive',
        },
        {
          id: 304263,
          code: '2',
          countryCode: 'tr',
          name: 'İstanbul Sabiha Gökçen Havalimanı (SAW)',
          isDomestic: true,
          providerName: 'Ekar',
        },
      ],
      pickupDate: '2025-01-15T00:00:00Z',
      pickupHour: '12',
      returnDate: '2025-01-25T00:00:00Z',
      returnHour: '13',
      driverAge: 22,
      receivedProviders: null,
      customerId: 0,
      customerUserId: 0,
      sessionToken:
        '7D3E355DFB308ED0FD1EA1F88D5B06B570EB893BE66DA93B452DB85F5585D7D5',
      apiRoute: null,
      apiAction: null,
      appName: null,
      scopeName: null,
      searchToken:
        '69A527BAEF4EE68B0C850B43257E05E11238C4E86B4B05418021849C97B024A6',
      scopeCode: '00000000-0000-0000-0000-000000000000',
    },
    sessionToken:
      '7D3E355DFB308ED0FD1EA1F88D5B06B570EB893BE66DA93B452DB85F5585D7D5',
    apiRoute: 'CarRentalService',
    apiAction: 'api/CarRental/Search',
    searchToken:
      '69A527BAEF4EE68B0C850B43257E05E11238C4E86B4B05418021849C97B024A6',
    appName: 'fulltrip.preprod.webapp.html',
    scopeName: 'FULLTRIP',
    scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
    customerId: 0,
    customerUserId: 0,
  },
  sessionToken:
    '7D3E355DFB308ED0FD1EA1F88D5B06B570EB893BE66DA93B452DB85F5585D7D5',
  apiRoute: 'CarRentalService',
  apiAction: 'api/CarRental/Search',
  requestType:
    'Service.Models.RequestModels.CarRentalSearchRequestModel, Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null',
  returnType:
    'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.CarRental.CarRentalSearchResponse, Core.Models.CarRental, Version=1.0.23.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null',
  device: 'WEB1D7CAEF28F75490DA6D3B874A6FBC926',
  languageCode: 'tr_TR',
  ipAddress: '::1',
  mlToken: '4b4ba96d-70e3-4df4-be17-61a254e97847',
}

export interface CarSearchRequest {
  params: Params
  sessionToken: string
  apiRoute: 'CarRentalService'
  apiAction: 'api/CarRental/Search'
  requestType: 'Service.Models.RequestModels.CarRentalSearchRequestModel, Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  returnType: 'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.CarRental.CarRentalSearchResponse, Core.Models.CarRental, Version=1.0.23.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  device: string
  languageCode: string
  ipAddress: string
  mlToken: string
}

export interface Params {
  carRentalSearchPanel: CarRentalSearchPanel
  sessionToken: string
  apiRoute: 'CarRentalService'
  apiAction: 'api/CarRental/Search'
  searchToken: string
  appName: string
  scopeName: string
  scopeCode: string
  customerId: number
  customerUserId: number
}

export interface CarRentalSearchPanel {
  origin: Origin[]
  destination: Destination[]
  pickupDate: string
  pickupHour: string
  returnDate: string
  returnHour: string
  driverAge: number
  receivedProviders: null | string[]
  customerId: number
  customerUserId: number
  sessionToken: string
  apiRoute: null
  apiAction: null
  appName: null
  scopeName: null
  searchToken: string
  scopeCode: string
}

export interface Origin {
  id: number
  code: string
  countryCode: string
  name: string
  isDomestic: boolean
  providerName: string
}

export interface Destination {
  id: number
  code: string
  countryCode: string
  name: string
  isDomestic: boolean
  providerName: string
}
