import { vi } from 'vitest'

import type { RenderOptions } from '@testing-library/react'

import { render as testingLibraryRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import { mantineTheme } from '@/styles/mantine/index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

vi.mock('next/font/google', () => ({
  Figtree: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))

vi.mock('next-view-transitions', () => ({
  Link: vi.fn(({ children, ...rest }) => <a {...rest}>{children}</a>),
}))

export function render(ui: React.ReactNode, props?: RenderOptions) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <SessionProvider
        session={{
          user: {
            name: 'senol keskin',
            email: 'senol@gmail.com',
            id: '1',
            image: '',
          },
          expires: new Date().toISOString(),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
        </QueryClientProvider>
      </SessionProvider>
    ),
    ...props,
  })
}
