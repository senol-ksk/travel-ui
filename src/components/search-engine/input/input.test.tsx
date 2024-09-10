import { test, expect, describe } from 'vitest'

import { render, screen } from '@/__test-utils__'
import { Input } from './input'

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

  test('should have error classes', () => {
    const { container } = render(
      <Input label={text} error={true} icon={'location'} />
    )
    const wrapper = container.querySelector('.grid.rounded.border')

    expect(wrapper).toHaveClass('border-red-500')
  })
  test('should have not error classes', () => {
    const { container } = render(
      <Input label={text} error={false} icon={'location'} />
    )
    const wrapper = container.querySelector('.grid.rounded.border')

    expect(wrapper).not.toHaveClass('border-red-500')
    expect(wrapper).toHaveClass('border-slate-300')
  })
})
