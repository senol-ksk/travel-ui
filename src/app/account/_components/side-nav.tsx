'use client'

import { NavLink } from '@mantine/core'
import { Link } from 'next-view-transitions'

import { IoIosLogOut } from 'react-icons/io'
import { FaRegUserCircle } from 'react-icons/fa'
import { RiFileUserLine } from 'react-icons/ri'
import { LiaFileInvoiceSolid } from 'react-icons/lia'
import { MdModeOfTravel } from 'react-icons/md'

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
        label='Kayıtlı Yolcularım'
        component={Link}
        href={'/account/passengers'}
        leftSection={<RiFileUserLine />}
      />
      <NavLink
        label='Fatura Bilgilerim'
        component={Link}
        href={'/account/invoices'}
        leftSection={<LiaFileInvoiceSolid />}
      />
      <NavLink
        label='Seyahatlerim'
        component={Link}
        href={'/account/'}
        leftSection={<MdModeOfTravel />}
      />
      <NavLink
        label='Oturumu Kapat'
        leftSection={<IoIosLogOut />}
        onClick={() => signOut()}
      />
    </div>
  )
}
