import type { AxiosRequestConfig, AxiosError } from 'axios'

import axios from 'axios'
import { ResponseStatus } from './app/reservation/types'
import { GetSecurityTokenResponse } from './types/global'
import md5 from 'md5'

const isServer = typeof window === 'undefined' || !window

const appName = isServer
  ? process.env.APP_NAME
  : process.env.NEXT_PUBLIC_APP_NAME
const scopeName = isServer
  ? process.env.SCOPE_NAME
  : process.env.NEXT_PUBLIC_SCOPE_NAME
const scopeCode = isServer
  ? process.env.SCOPE_CODE
  : process.env.NEXT_PUBLIC_SCOPE_CODE

const client = axios.create({
  baseURL: '/',
})

const request = async (options: AxiosRequestConfig) => {
  try {
    const response = await client({
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    return response.data
  } catch (error) {
    const err = error as Error | AxiosError

    if (axios.isAxiosError(err)) {
      return Promise.reject({
        message: err.message,
        code: err.code,
        response: err.response,
      })
    }

    // return err
    throw new Error('An error occurred ', { cause: err })
  }
}

type ServiceRequestParams = {
  axiosOptions: AxiosRequestConfig
}

export type ServiceResponse<T> = {
  success: boolean
  statusCode: ResponseStatus
  message: string | null
  errors: string | null
  validModelState: string | null
  data: T | null
}

async function serviceRequest<DataType>({
  axiosOptions,
}: ServiceRequestParams): Promise<ServiceResponse<DataType> | undefined> {
  const url =
    typeof window === 'undefined'
      ? `${process.env.SERVICE_PATH ?? ''}/${axiosOptions.url}`.replace(
          /([^:])(\/{2,})/g,
          '$1/'
        )
      : `${process.env.NEXT_PUBLIC_SERVICE_PATH ?? ''}/${axiosOptions.url}`.replace(
          /([^:])(\/{2,})/g,
          '$1/'
        )

  try {
    const response = await client<ServiceResponse<DataType>>({
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': '*',
      },
      ...axiosOptions,
      url,
    })

    return response.data
  } catch (error) {
    const err = error as Error | AxiosError

    if (axios.isAxiosError(err)) {
      return Promise.reject({
        message: err.message,
        code: err.code,
        response: err.response,
      })
    }

    throw new Error('An error occurred ', { cause: err })
  }
}

export type OLResponse<T> = {
  success: boolean
  code: number
  data: T
  sessionToken: string | null
}

type OlRequestDataType = AxiosRequestConfig['data']

interface OlRequestWithParamsType extends OlRequestDataType {
  params?: AxiosRequestConfig['data']
  returnType?: string
  requestType?: string
}

async function olRequest<T>({
  apiAction,
  apiRoute,
  data,
  signal,
}: {
  apiAction: string
  apiRoute: string
  data?: OlRequestWithParamsType
  signal?: AxiosRequestConfig['signal']
}): Promise<OLResponse<T> | undefined> {
  const url = isServer
    ? `${process.env.OL_ROUTE}`
    : `${process.env.NEXT_PUBLIC_OL_ROUTE}`

  const device = isServer
    ? `${process.env.DEVICE_ID}`
    : `${process.env.NEXT_PUBLIC_DEVICE_ID}`

  if (!appToken) {
    await getsecuritytoken()
  }

  const payload = {
    params: {
      apiAction,
      apiRoute,
      appName,
      scopeName,
      scopeCode,
      ...data?.params,
    },
    languageCode: 'tr_TR',
    appName,
    scopeName,
    scopeCode,
    device,
    apiAction,
    apiRoute,
    requestType: data?.requestType,
    returnType: data?.returnType,
    sessionToken: data?.params.sessionToken,
  }

  const response = await request({
    url,
    method: 'post',
    signal,
    data: payload,
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  return response
}

const authToken = md5(
  process.env.NEXT_PUBLIC_DEVICE_ID + process.env.NEXT_PUBLIC_SECURE_STRING
).toLocaleUpperCase()

let appToken = ''
export const getsecuritytoken = async (): Promise<GetSecurityTokenResponse> => {
  const getToken = await request({
    url: isServer
      ? process.env.SECURITY_ROUTE
      : process.env.NEXT_PUBLIC_SECURITY_ROUTE,
    method: 'post',
    data: {
      authToken,
      envName: isServer
        ? process.env.APP_NAME
        : process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  appToken = getToken.result

  return getToken
}

export const getSessionToken = async (): Promise<string | undefined> => {
  if (!appToken) await getsecuritytoken()

  const response = await request({
    url: isServer
      ? process.env.GET_SESSION_TOKEN
      : process.env.NEXT_PUBLIC_GET_SESSION_TOKEN,
    method: 'post',
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  return response
}

type BusSearchSessionTokenResponse = {
  data: string
  sessionToken: string
}

export const getBusSearchSessionToken = async () => {
  if (!appToken) {
    await getsecuritytoken()
  }

  const response = (await request({
    url: process.env.NEXT_PUBLIC_OL_ROUTE,
    method: 'post',
    data: {
      params: {
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      },
      apiRoute: 'BusService',
      apiAction: 'api/Bus/GetNewSearchSessionToken',
      sessionToken: '',
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
      scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      RequestType:
        'TravelAccess.Core.Models.Bus.BusSearchRequest, TravelAccess.Core.Models.Bus, Version=1.0.4',
    },
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })) as BusSearchSessionTokenResponse

  return {
    sessionToken: response.sessionToken,
    searchToken: response.data,
    appToken,
  }
}
export const getTransferSearchSessionToken = async () => {
  if (!appToken) {
    await getsecuritytoken()
  }

  const response = (await request({
    url: process.env.NEXT_PUBLIC_OL_ROUTE,
    method: 'post',
    data: {
      params: {
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      },
      apiRoute: 'BusService',
      apiAction: 'api/Bus/GetNewSearchSessionToken',
      sessionToken: '',
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
      scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      RequestType:
        'TravelAccess.Core.Models.Bus.BusSearchRequest, TravelAccess.Core.Models.Bus, Version=1.0.4',
    },
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })) as BusSearchSessionTokenResponse

  return {
    sessionToken: response.sessionToken,
    searchToken: response.data,
  }
}
export const getFlightSearchSessionToken = async () => {
  if (!appToken) {
    await getsecuritytoken()
  }

  const response = (await request({
    url: process.env.NEXT_PUBLIC_OL_ROUTE,
    method: 'post',
    data: {
      params: {
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      },
      apiRoute: 'FlightService',
      apiAction: 'api/Flight/GetNewSearchSessionToken',
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
      scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
    },
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })) as BusSearchSessionTokenResponse | null

  if (!response) return null
  return {
    sessionToken: response.sessionToken,
    searchToken: response.data,
  }
}

export { request, serviceRequest, olRequest }
