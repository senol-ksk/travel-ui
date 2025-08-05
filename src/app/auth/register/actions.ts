'use server'

// import { resend } from '@/libs/resend'
import { RegisterSchemaTypes } from './schema'
import { serviceRequest } from '@/network'

export async function registerActions(
  params: RegisterSchemaTypes,
  siteURL: string
) {
  const response = await serviceRequest<{
    name: string
    returnUrl: null
    searchToken: null
    sessionToken: null
    userAuthenticationToken: string
  } | null>({
    axiosOptions: {
      url: 'api/account/register',
      method: 'post',
      data: {
        ...params,
        siteURL,
      },
    },
  })

  if (response?.success) {
    console.log('basarili islem')
    // const emailSender = await resend.emails.send({
    //   from: process.env.EMAIL_FROM,
    //   to: 'msenolkeskin@gmail.com',
    //   subject: 'Kullanıcı Aktivasyonu',
    //   html: `<h1>Tebrikler falan filan</h1><p>${params.name} ${params.surname}</p>`,
    // })

    return response
  }

  return response
}
