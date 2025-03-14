import { vi } from 'vitest'

import type { RenderOptions } from '@testing-library/react'

import { render as testingLibraryRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import { mantineTheme } from '@/styles/mantine/index'

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
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    ),
    ...props,
  })
}
