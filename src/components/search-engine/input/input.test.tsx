import { test, expect, describe } from 'vitest'

import { render, screen } from '@/__test-utils__'
import { Input } from './input'

const text = 'Label Value'

describe('Search Engine Components', () => {
  test('input component should have label', () => {
    render(<Input label={text} />)
    const label = screen.getByLabelText(text)

    expect(label).toHaveTextContent(text)
  })

  test('label should be hidden when no `title`', () => {
    render(<Input label={text} />)
    const label = screen.getByLabelText(text)

    expect(label).toHaveClass('sr-only')
  })

  test('label should not be hidden when no `title`', () => {
    render(<Input label={text} title={'Heloo'} />)
    const label = screen.getByLabelText(text)

    expect(label).not.toHaveClass('sr-only')
  })
})
