import { act, fireEvent, render, screen, waitFor } from '@/__test-utils__'
import { describe, expect, test } from 'vitest'
import { Locations } from './location'

describe('Search engine locations', () => {
  test('should open autocomplete box', async () => {
    render(<Locations label='Testing' />)

    const inputFakeButton = screen.getByRole('button', { name: 'Testing' })

    fireEvent.click(inputFakeButton)

    await waitFor(() => {
      const locationInput = screen.getByRole('textbox')
      expect(locationInput).toBeInTheDocument()
    })
  })

  test('should clear input value', async () => {
    // 'Aramayı temizle'
    render(<Locations label='Testing' />)

    const inputFakeButton = screen.getByRole('button', { name: 'Testing' })

    fireEvent.click(inputFakeButton)

    await waitFor(() => {
      const locationInput = screen.getByRole('textbox')
      const clearButton = screen.getByLabelText('Aramayı temizle')

      fireEvent.click(clearButton)
      expect(locationInput).toHaveValue('')
    })
  })
})
