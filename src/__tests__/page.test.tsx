import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Layout from '../app/layout'

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))

test('should have text', () => {
  render(<Layout>children</Layout>)
  var logo = screen.getByRole('img', { name: /Fulltrip/i })

  expect(logo).toBeDefined()
})
