import { test, expect, describe } from 'vitest'
import { render, screen } from '@/__test-utils__'

import Header from '@/components/header'

describe('Logo', () => {
  test('should be defined', () => {
    render(<Header />)
    const logo = screen.getByRole('img', { name: /Fulltrip/i })
    expect(logo).toBeInTheDocument()
  })
})
