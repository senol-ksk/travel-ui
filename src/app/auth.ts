import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

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
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  session: {
    maxAge: 1200,
  },
  providers: [
    Credentials({
      type: 'credentials',
      credentials: { name: {} },
      authorize: async (credentials) => {
        console.log(credentials)
        if (!credentials || typeof credentials.name !== 'string') {
          return null
        }

        return {
          name: credentials.name,
        }
      },
    }),
  ],
})
