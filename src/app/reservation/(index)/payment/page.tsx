import { ReservationLayout } from '../_components/page-layout'
import { PaymentPageSection } from '../_components/payment-page'
// import { CreditCardForm } from '@/components/payment/credit-card'

const PaymentPage = () => {
  return (
    <ReservationLayout>
      <PaymentPageSection />
    </ReservationLayout>
  )
}

export default PaymentPage
