import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'
import { ResponseStatus } from './app/reservation/types'
import { GetSecurityTokenResponse } from './types/global'
import md5 from 'md5'

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
    console.error(error)
  }
}

export { request, serviceRequest }

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

  return getToken
}
