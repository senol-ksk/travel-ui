import { redirect } from 'next/navigation'

export async function POST(request: Request) {
  const formData = await request.formData()
  const _inputName = formData.get('inputName')

  redirect('/reservation/success')
  return Response.json({ status: true })
}
