import { Title } from '@mantine/core'
import { ParafCalculate } from './_components/paraf-calculate-form'

export default function ParafCalculatePage() {
  return (
    <div>
      <Title>ParafPara Hesaplama</Title>
      <div>
        Satınlamak istediğiniz seyahat ürünün ParafPara değerini
        hesaplayabilirsiniz.
      </div>
      <ParafCalculate />
    </div>
  )
}
