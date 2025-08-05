'use server'

import { serviceRequest } from '@/network'
import { RegisterSchemaTypes } from '../schema'

export default async function POST() {
  // console.log(formData)
  // const submitHandler = async () => {
  //   const response = await serviceRequest<{
  //     name: string
  //     returnUrl: null
  //     searchToken: null
  //     sessionToken: null
  //     userAuthenticationToken: string
  //   }>({
  //     axiosOptions: {
  //       url: 'api/account/register',
  //       method: 'post',
  //       data: {
  //         ...data,
  //         siteURL: window.location.origin,
  //       },
  //     },
  //   })
  //   if (response?.success) {
  //     console.log('basarili islem')
  //   } else {
  //     console.error('hatali islem')
  //   }
  // }
}
