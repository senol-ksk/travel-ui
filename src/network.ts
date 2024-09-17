import type { AxiosRequestConfig, AxiosError } from 'axios'

import axios from 'axios'

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

export { request }
