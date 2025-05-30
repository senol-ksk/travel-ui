'use client'

import { CheckoutCard } from '@/components/card'
import { ParafParaView } from '../../components/paraf'

import data from './paraf-para-dummy-response.json'

export default function ParafParaPage() {
  return (
    <CheckoutCard>
      <ParafParaView data={data.data} />
    </CheckoutCard>
  )
}
