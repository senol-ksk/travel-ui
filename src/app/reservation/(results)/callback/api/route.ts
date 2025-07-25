import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { request as axiosRequest, serviceRequest } from '@/network'
import { ResponseStatus } from '@/app/reservation/types'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const paymenttoken = request.nextUrl.searchParams.get('paymenttoken')

  const bookResult = await serviceRequest<{
    moduleName: string
    orderId: string
    searchToken: string
    sessionToken: string
    productKey: string
  }>({
    axiosOptions: {
      url: `/api/payment/complete?paymenttoken=${paymenttoken}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  })

  console.log(bookResult)

  if (bookResult && bookResult?.success) {
    const bookResultParams = new URLSearchParams(bookResult.data || '')

    await serviceRequest({
      axiosOptions: {
        url: `/api/product/complete`,
        method: 'POST',
        data: bookResult.data,
      },
    })

    return redirect(`/reservation/callback?${bookResultParams}`)
  }

  return redirect(`/reservation/error?paymenttoken=${paymenttoken}`)
}
