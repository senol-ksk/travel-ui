import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { request as axiosRequest, serviceRequest } from '@/network'
import { ResponseStatus } from '@/app/reservation/types'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const url = `${process.env.SERVICE_PATH}/api/payment/complete?paymenttoken=${request.nextUrl.searchParams.get('paymenttoken')}`

  const bookResult = await serviceRequest<{
    moduleName: string
    orderId: string
    searchToken: string
    sessionToken: string
  }>({
    axiosOptions: {
      url,
      withCredentials: true,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  })

  if (bookResult.success) {
    const bookResultParams = new URLSearchParams(bookResult.data || '')

    await serviceRequest({
      axiosOptions: {
        url: `${process.env.SERVICE_PATH}/api/book/complete`,
        method: 'POST',
        data: bookResult.data,
      },
    })

    return redirect(`/reservation/callback?${bookResultParams}`)
  }

  return redirect('/reservation/error?noDataRecieved')
}
