import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { request as axiosRequest } from '@/network'
import { ResponseStatus } from '@/app/reservation/types'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const url = `${process.env.SERVICE_PATH}/api/payment/complete?paymenttoken=${request.nextUrl.searchParams.get('paymenttoken')}`

  const bookResult = (await axiosRequest({
    url,
    withCredentials: true,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })) as {
    success: boolean
    statusCode: ResponseStatus.Success
    data: {
      moduleName: string
      orderId: string
      searchToken: string
      sessionToken: string
    } | null
  }

  if (bookResult.success) {
    const bookResultParams = new URLSearchParams(bookResult.data || '')
    const _ = (await axiosRequest({
      url: `${process.env.SERVICE_PATH}/api/book/complete`,
      method: 'POST',
      data: bookResult.data,
    })) as { status: number }

    return redirect(`/reservation/callback?${bookResultParams}`)
  }

  return redirect('/reservation/error?noDataRecieved')
}
