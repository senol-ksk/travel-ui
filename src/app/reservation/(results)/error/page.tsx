import Link from 'next/link'

const CheckoutErrorPage = () => {
  return (
    <div className='container pt-5'>
      <div>İşlem başarısız, lütfen başka bir kart ile tekrar deneyin.</div>
      <div>
        <Link href={'/'}>Ana Sayfa</Link>
      </div>
    </div>
  )
}

export default CheckoutErrorPage
