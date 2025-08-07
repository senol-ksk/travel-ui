import { serviceRequest } from '@/network'

export async function forgotPasswordAction({
  email,
  siteURL,
}: {
  email: string
  siteURL: string
}) {
  const serviceResponse = await serviceRequest({
    axiosOptions: {
      url: 'api/account/handleForgotPassword',
      method: 'post',
      data: {
        email,
        siteURL,
      },
    },
  })

  return serviceResponse
}
