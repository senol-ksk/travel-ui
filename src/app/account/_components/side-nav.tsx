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
type Props = {
  insideClose?: () => void
}
export default function AccountSideNav({ insideClose }: Props) {
  return (
    <div>
      <NavLink
        label='Hesap Bilgilerim'
        component={Link}
        href={'/account'}
        leftSection={<FaRegUserCircle />}
        onClick={insideClose}
      />
      <NavLink
        label='Rezervasyonlarım'
        component={Link}
        href={'/account/reservations'}
        leftSection={<MdOutlineLuggage />}
        onClick={insideClose}
      />
      <NavLink
        label='Kayıtlı Yolcularım'
        component={Link}
        href={'/account/passengers'}
        leftSection={<MdOutlineContacts />}
        onClick={insideClose}
      />
      <NavLink
        label='Fatura Bilgilerim'
        component={Link}
        href={'/account/invoices'}
        leftSection={<MdOutlineReceiptLong />}
        onClick={insideClose}
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
