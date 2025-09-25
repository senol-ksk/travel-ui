import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// import { cookies, headers } from 'next/headers'

// const getUserInfo = async () => {
//   const cookieStore = await cookies()

//   return serviceRequest<Account>({
//     axiosOptions: {
//       url: 'api/account/user-info',
//       withCredentials: true,
//       headers: { Cookie },
//     },
//   })
// }

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: Account & DefaultSession['user']
    user: {} & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
  },
  trustHost: true,
  session: {
    maxAge: 1200,
  },
  // callbacks: {
  //   async session({ session, token }) {
  //     const userInfo = await getUserInfo()

  //     console.log(userInfo)

  //     if (userInfo?.success && userInfo.data) {
  //       const { surname, name } = userInfo.data

  //       return {
  //         ...session,
  //         user: {
  //           ...session.user,
  //           surname,
  //           name,
  //         },
  //       }
  //     }

  //     return session
  //   },
  // },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (!credentials || typeof credentials.name !== 'string') {
          return null
        }

        // const userInfo = await getUserInfo()

        // if (!userInfo?.success || !userInfo.data) return null

        return { ...credentials }
      },
    }),
  ],
})
