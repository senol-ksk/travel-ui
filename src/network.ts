import type { AxiosRequestConfig, AxiosError } from 'axios'

import axios from 'axios'
import { ResponseStatus } from './app/reservation/types'
import { GetSecurityTokenResponse } from './types/global'
import md5 from 'md5'

const client = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Credentials': '*',
  },
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

    return err
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
      ? `${process.env.SERVICE_PATH}/${axiosOptions.url}`.replace(
          /([^:])(\/{2,})/g,
          '$1/'
        )
      : `${process.env.NEXT_PUBLIC_SERVICE_PATH}/${axiosOptions.url}`.replace(
          /([^:])(\/{2,})/g,
          '$1/'
        )

  try {
    const response = await client<ServiceResponse<DataType>>({
      headers: {
        'Content-Type': 'application/json',
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

    console.log('Unhandled error ===> ', err)

    // return err
  }
}

async function olRequest() {}

const authToken = md5(
  process.env.NEXT_PUBLIC_DEVICE_ID + process.env.NEXT_PUBLIC_SECURE_STRING
).toLocaleUpperCase()

export const getsecuritytoken = async (): Promise<GetSecurityTokenResponse> => {
  const getToken = await request({
    url: process.env.NEXT_PUBLIC_SECURITY_ROUTE,
    method: 'post',
    data: {
      authToken,
      envName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  appToken = getToken.result

  return getToken
}

let appToken = ''

export const getSessionToken = async (): Promise<string | undefined> => {
  if (!appToken) await getsecuritytoken()

  const response = await request({
    url: process.env.NEXT_PUBLIC_GET_SESSION_TOKEN,
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

export { request, serviceRequest }
