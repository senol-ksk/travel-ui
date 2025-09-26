import { test, expect, describe, vi, beforeEach } from 'vitest'
import { render, screen } from '@/__test-utils__'

vi.mock('@/libs/cms-data', () => {
  return {
    getWidgetsByCollectionSlug: vi.fn(async () => ({
      data: [
        {
          id: 1,
          title: 'Main',
          typeId: 1,
          collectionId: 1,
          point: 'header',
          params: {
            sort_description: { value: '' },
            description: { value: '' },
            btn_text: { value: '' },
            link: { value: '' },
            image: { value: '' },
            svg: { value: '' },
            view_country: { value: '' },
            customer_service: { value: '' },
            footer_menu: { menus: [] },
            main_menu: {
              menus: [
                { id: 11, url: '/', title: 'Otel' },
                { id: 12, url: '/flight', title: 'Uçak' },
                { id: 13, url: '/car', title: 'Araç' },
              ],
            },
          },
          ordering: 1,
          language: 'tr',
          active: true,
        },
      ],
    })),
  }
})

import Header from '@/components/header'

describe('Logo', () => {
  test('should be defined', () => {
    render(<Header />)
    const logo = screen.getByRole('img', { name: /Paraflytravel/i })
    expect(logo).toBeInTheDocument()
  })
})

describe('Header menus (mocked CMS)', () => {
  test('renders main menu items from CMS without hitting network', async () => {
    render(<Header />)

    expect(await screen.findByText('Otel')).toBeInTheDocument()
    expect(await screen.findByText('Uçak')).toBeInTheDocument()
    expect(await screen.findByText('Araç')).toBeInTheDocument()
  })
})
