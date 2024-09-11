import type { AxiosRequestConfig } from 'axios'

import axios from 'axios'

const client = axios.create({
  baseURL: '/',
})

const request = async (options: AxiosRequestConfig) => {
  const response = await client(options)

  return response.data
}

export { request }
