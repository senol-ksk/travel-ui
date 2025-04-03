import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { cookies } from 'next/headers'

import { serviceRequest } from '@/network'
import dayjs from 'dayjs'

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  // interface User {}
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: {
      name: string
      email: string
      lastName: string
    } & DefaultSession['user']
  }
}

const expireDate = dayjs().add(1, 'M').toDate()

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null

        const response = await serviceRequest<{
          name: string
          returnUrl: null
          searchToken: null
          sessionToken: null
          userAuthenticationToken: string
        }>({
          axiosOptions: {
            url: 'api/account/login',
            method: 'post',
            data: {
              loginForm: {
                email: credentials.email,
                password: credentials.password,
              },
            },
          },
        })

        if (!response?.success || !response.data) {
          return null
        }

        const cookieStore = await cookies()
        cookieStore.set({
          name: 'UserAuthenticationToken',
          value: response.data?.userAuthenticationToken,
          httpOnly: true,
          secure: true,
          path: '/',
          expires: expireDate,
        })

        return {
          name: response.data?.name,
        }
      },
    }),
  ],
})
