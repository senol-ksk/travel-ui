import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import Page from '../app/page'
// import { expect } from 'vitest'

test('should have text', () => {
  render(<Page />)
  var heading = screen.getByRole('heading', { level: 1, name: 'Hello' })

  expect(heading).toBeDefined()
})
