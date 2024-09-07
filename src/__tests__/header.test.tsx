import { test, expect, vi, describe, beforeEach } from 'vitest'
import { render, screen } from '@/__test-utils__'

import Header from '@/components/header'

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))

describe('Logo', () => {
  test('should be defined', () => {
    render(<Header />)
    var logo = screen.getByRole('img', { name: /Fulltrip/i })
    expect(logo).toBeInTheDocument()
  })
})
