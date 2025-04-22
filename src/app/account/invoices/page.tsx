import { InvoiceForm } from './_components/invoice-form'
import { SavedInvoices } from './_components/save-invoices'

export default function InvoicePage() {
  return (
    <div className='grid gap-3'>
      <div>
        <SavedInvoices />
      </div>
      <div>
        <InvoiceForm />
      </div>
    </div>
  )
}
