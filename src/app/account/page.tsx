import { redirect } from 'next/navigation'
import { auth } from '../auth'

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    return redirect('/auth/login')
  }

  return <div>account home</div>
}
