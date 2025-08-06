'use client'
import PersonLetters from '../../_components/person-letters'
import AccountSideNav from '../../_components/side-nav'

export default function ClientAccountLayout() {
  return (
    <>
      <div className='sticky top-0 col-span-2 hidden flex-col gap-2 md:flex'>
        <div>
          <PersonLetters />
        </div>
        <div className='rounded-md border p-2 shadow'>
          <AccountSideNav />
        </div>
      </div>
    </>
  )
}
