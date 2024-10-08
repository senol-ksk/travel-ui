import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/__test-utils__'
import { describe, expect, test } from 'vitest'
import { PassengerDropdown } from '@/components/search-engine/passengers'

describe('Flight passengers dropdown', () => {
  test('search engine value should match', async () => {
    render(
      <PassengerDropdown
        initialValues={{
          Adult: 1,
          Child: 0,
          Infant: 0,
        }}
      />
    )
    expect(screen.getByRole('button')).toHaveTextContent('1 Yolcu')
  })

  test('should open passenger dropdown', async () => {
    render(
      <PassengerDropdown
        initialValues={{
          Adult: 1,
          Child: 0,
          Infant: 0,
        }}
      />
    )
    const dropdownButton = screen.getByRole('button', { name: /1 Yolcu/ })

    fireEvent.click(dropdownButton)

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible()
    })
  })

  test('should passenger menu intials', async () => {
    render(
      <PassengerDropdown
        initialValues={{
          Adult: 1,
          Child: 0,
          Infant: 0,
        }}
      />
    )
    const dropdownButton = screen.getByRole('button', { name: /1 Yolcu/ })

    fireEvent.click(dropdownButton)

    await waitFor(() => {
      expect(screen.getByLabelText('decrease-adult')).toBeDisabled()
      expect(screen.getByLabelText('increase-adult')).not.toBeDisabled()
      expect(screen.getByLabelText('adult-count')).toHaveTextContent('1')

      expect(screen.getByLabelText('decrease-child')).toBeDisabled()
      expect(screen.getByLabelText('increase-child')).not.toBeDisabled()
      expect(screen.getByLabelText('child-count')).toHaveTextContent('0')

      expect(screen.getByLabelText('decrease-infant')).toBeDisabled()
      expect(screen.getByLabelText('increase-infant')).not.toBeDisabled()
      expect(screen.getByLabelText('infant-count')).toHaveTextContent('0')
    })
  })

  test('increase and decrease buttons should work', async () => {
    render(
      <PassengerDropdown
        initialValues={{
          Adult: 1,
          Child: 0,
          Infant: 0,
        }}
      />
    )
    const dropdownButton = screen.getByRole('button', { name: /1 Yolcu/ })

    fireEvent.click(dropdownButton)
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('decrease-adult'))

      expect(screen.getByLabelText('adult-count')).toHaveTextContent('1')

      fireEvent.click(screen.getByLabelText('increase-adult'))

      expect(screen.getByLabelText('adult-count')).toHaveTextContent('2')
    })
  })
})
