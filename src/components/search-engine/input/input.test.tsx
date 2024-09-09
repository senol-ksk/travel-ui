import { test, expect, describe, vi } from 'vitest'

import { render, screen } from '@/__test-utils__'
import { Input } from './input'

vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))
const text = 'Label Value'

describe('Search Engine Components', () => {
  test('input component should have label', () => {
    render(<Input label={text} icon={'calendar'} />)
    const label = screen.getByLabelText(text)

    expect(label).toHaveTextContent(text)
  })

  test('button should have same text content when there is no title', () => {
    render(<Input label={text} icon={'calendar'} />)

    const button = screen.getByRole('button')
    expect(button).toHaveTextContent(text)
  })

  test('label should be hidden when no `title`', () => {
    render(<Input label={text} icon={'calendar'} />)
    const label = screen.getByLabelText(text)

    expect(label).toHaveClass('opacity-0')
  })

  test('label should not be hidden when no `title`', () => {
    render(<Input label={text} icon={'calendar'} title={'Heloo'} />)
    const label = screen.getByLabelText(text)

    expect(label).not.toHaveClass('opacity-0')
  })
})
