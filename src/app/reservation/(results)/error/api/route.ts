import { type Route } from 'next'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const mdstatus = formData.get('mdstatus')
  const ErrorCode = formData.get('ErrorCode')
  const status = mdstatus || ErrorCode || -1
  const message = encodeURIComponent(
    formData.get('responseMessage')?.toString() || ''
  )

  return redirect(
    `${request.nextUrl.origin}/reservation/error?status=${status}&message=${message}` as Route
  )
}
