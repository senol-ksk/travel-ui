import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { serviceRequest } from '@/network'

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

  if (bookResult && bookResult?.success && bookResult.data) {
    const bookResultParams = new URLSearchParams(bookResult.data)

    const completeResponse = await serviceRequest({
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
