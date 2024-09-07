import type { RenderOptions } from '@testing-library/react'

import { render as testingLibraryRender } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

import { theme } from '@/theme'

export function render(ui: React.ReactNode, props?: RenderOptions) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={theme}>{children}</MantineProvider>
    ),
    ...props,
  })
}
