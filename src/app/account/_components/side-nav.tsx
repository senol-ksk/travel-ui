'use client'

import { NavLink } from '@mantine/core'
import { Link } from 'next-view-transitions'

import { IoIosLogOut } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import {
  MdOutlineContacts,
  MdOutlineLuggage,
  MdOutlineReceiptLong,
} from 'react-icons/md'

import { signOut } from 'next-auth/react'

export default function AccountSideNav() {
  return (
    <div>
      <NavLink
        label='Üyelik Bilgileri'
        component={Link}
        href={'/account/'}
        leftSection={<FaRegUserCircle />}
      />
      <NavLink
        label='Rezervasyonlarım'
        component={Link}
        href={'/account/reservations'}
        leftSection={<MdOutlineLuggage />}
      />
      <NavLink
        label='Kayıtlı Yolcularım'
        component={Link}
        href={'/account/passengers'}
        leftSection={<MdOutlineContacts />}
      />
      <NavLink
        label='Fatura Bilgilerim'
        component={Link}
        href={'/account/invoices'}
        leftSection={<MdOutlineReceiptLong />}
      />

      <NavLink
        label='Oturumu Kapat'
        leftSection={<IoIosLogOut />}
        onClick={() => signOut()}
        className='text-red-800'
      />
    </div>
  )
}
